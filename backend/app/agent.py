import os
import json
from typing import TypedDict, Optional
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Interaction, HCP

load_dotenv()

# Define LangGraph Agent State
class AgentState(TypedDict):
    user_input: str
    extracted_data: Optional[dict]
    sentiment: Optional[str]
    follow_ups: Optional[str]
    matched_hcp: Optional[str]
    final_output: Optional[dict]
    interaction_id: Optional[int]

# Core LLM Engine Constraint
llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=os.getenv("GROQ_API_KEY"))

# --- THE 5 REQUIRED LANGGRAPH TOOLS ---

# Tool 1: Search HCP (Matches names dynamically)
def tool_search_hcp(state: AgentState) -> dict:
    db: Session = SessionLocal()
    text = state["user_input"]
    hcps = db.query(HCP).all()
    matched = "Unknown HCP"
    for hcp in hcps:
        if hcp.name.lower() in text.lower():
            matched = hcp.name
            break
    db.close()
    return {"matched_hcp": matched}

# Tool 2: Log Interaction (Extracts entities and summarizes)
def tool_log_interaction(state: AgentState) -> dict:
    text = state["user_input"]
    hcp = state.get("matched_hcp", "Unknown")
    
    prompt = f"""
    You are a life sciences data extraction expert. Parse this field representative text: "{text}".
    Return a valid JSON object ONLY. Do not write any explanation.
    JSON structure: {{
        "hcp_name": "{hcp}",
        "date": "Extract if mentioned, else empty string",
        "time": "Extract if mentioned, else empty string",
        "attendees": "Extract human names mentioned, else empty",
        "topics_discussed": "Summarize key discussion points",
        "materials_shared": "Extract materials or brochures mentioned",
        "samples_distributed": "Extract any physical medical samples",
        "outcomes": "Summarize agreements or next checkpoints"
    }}
    """
    response = llm.invoke(prompt)
    try:
        cleaned_content = response.content.strip().strip("```json").strip("```")
        extracted = json.loads(cleaned_content)
    except Exception:
        extracted = {"hcp_name": hcp, "topics_discussed": text}
        
    return {"extracted_data": extracted}

# Tool 3: Extract Sentiment
def tool_extract_sentiment(state: AgentState) -> dict:
    text = state["user_input"]
    prompt = f"Analyze the field sentiment of this conversation note: '{text}'. Reply with exactly one word: Positive, Neutral, or Negative."
    response = llm.invoke(prompt)
    sentiment = response.content.strip()
    if "positive" in sentiment.lower(): sentiment = "Positive"
    elif "negative" in sentiment.lower(): sentiment = "Negative"
    else: sentiment = "Neutral"
    return {"sentiment": sentiment}

# Tool 4: Suggest Follow Ups
def tool_suggest_follow_ups(state: AgentState) -> dict:
    text = state["user_input"]
    prompt = f"Based on this pharma sales conversation log: '{text}', output a short markdown bullet list of 2 logical follow-up actions."
    response = llm.invoke(prompt)
    return {"follow_ups": response.content.strip()}

# Tool 5: Edit Interaction (Modifies data cleanly)
def tool_edit_interaction(state: AgentState) -> dict:
    db: Session = SessionLocal()
    int_id = state.get("interaction_id")
    text = state["user_input"]
    
    if int_id:
        db_interaction = db.query(Interaction).filter(Interaction.id == int_id).first()
        if db_interaction:
            db_interaction.topics_discussed += f" (Amended: {text})"
            db.commit()
    db.close()
    return {}

# Final State Combiner Node
def final_combiner(state: AgentState) -> dict:
    data = state.get("extracted_data", {})
    data["sentiment"] = state.get("sentiment", "Neutral")
    data["follow_up_actions"] = state.get("follow_ups", "")
    if state.get("matched_hcp") != "Unknown HCP":
        data["hcp_name"] = state.get("matched_hcp")
    return {"final_output": data}

# --- COMPOSE THE LANGGRAPH STATE GRAPH ---
builder = StateGraph(AgentState)

builder.add_node("search_hcp", tool_search_hcp)
builder.add_node("log_interaction", tool_log_interaction)
builder.add_node("extract_sentiment", tool_extract_sentiment)
builder.add_node("suggest_follow_ups", tool_suggest_follow_ups)
builder.add_node("combiner", final_combiner)

builder.set_entry_point("search_hcp")
builder.add_edge("search_hcp", "log_interaction")
builder.add_edge("log_interaction", "extract_sentiment")
builder.add_edge("extract_sentiment", "suggest_follow_ups")
builder.add_edge("suggest_follow_ups", "combiner")
builder.add_edge("combiner", END)

compiled_agent = builder.compile()