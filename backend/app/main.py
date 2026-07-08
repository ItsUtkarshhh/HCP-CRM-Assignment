from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import schemas, models
from pydantic import BaseModel
from typing import Optional  # 👈 Added for handling optional fields safely
from .database import engine, Base, get_db
from .models import Interaction, HCP
from .agent import compiled_agent

# Instantly create local database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First HCP CRM Backend")

# Allow communications from our future React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    interaction_id: int = None

# 🛠️ Refactored validation schema to allow empty/optional text fields safely
class ManualLogRequest(BaseModel):
    hcp_name: str
    interaction_type: str
    date: str
    time: str
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    sentiment: Optional[str] = "Neutral"
    outcomes: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

# Populate mockup doctors automatically if empty
@app.on_event("startup")
def setup_mock_data():
    db = next(get_db())
    if db.query(HCP).count() == 0:
        db.add(HCP(name="Dr. Smith", specialty="Cardiology"))
        db.add(HCP(name="Dr. Shreema", specialty="Oncology"))
        db.commit()
    db.close()

@app.post("/api/chat")
def process_chat_to_form(req: ChatRequest):
    # Runs the prompt string through the LangGraph agent workflow
    inputs = {"user_input": req.message, "interaction_id": req.interaction_id}
    result = compiled_agent.invoke(inputs)
    return result["final_output"]

@app.post("/api/interactions")
def save_form_data(req: ManualLogRequest, db: Session = Depends(get_db)):
    # req.dict() is deprecated in newer Pydantic, using model_dump() safely resolves it
    payload = req.model_dump() if hasattr(req, "model_dump") else req.dict()
    new_log = Interaction(**payload)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"status": "success", "id": new_log.id}