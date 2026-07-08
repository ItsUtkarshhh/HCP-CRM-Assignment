# AI-First Healthcare Professional (HCP) CRM Logger

An intelligent, full-stack CRM utility that leverages an advanced LLM orchestration agent to convert unstructured, conversational representative field notes into clean, structured enterprise CRM logs.

---

## 🚀 Project Overview & Core Functionality

In the pharmaceutical and medical device industries, Medical Science Liaisons (MSLs) and sales representatives meet with healthcare providers daily. Manually entering granular metrics into traditional CRM portals is time-consuming and often leads to data omission. 

This application solves this friction by providing a data-synchronized, split-screen desktop utility:
- **Right Panel (AI Copilot Chat):** Allows the user to input natural, unstructured conversational field descriptions.
- **Left Panel (Structured CRM Form):** Listens to a unified Redux global store. A LangGraph agent parses the user's chat stream using 5 distinct tool-calling structures and instantly auto-populates the corresponding form fields in real-time.

---

## 🧰 The 5 LangGraph Tools Implemented

The LangGraph backend acts as a stateful agent router. When an entry is analyzed, the LLM determines which extraction schemas to call:

1. **`Log Interaction`**: Extracts core structural parameters including `hcp_name`, `interaction_type`, and `date`.
2. **`Extract Topics & Materials`**: Parses clinical session contexts, trial details, and specific shared assets (e.g., slide decks, presentation materials, sample allocations).
3. **`Analyze Sentiment`**: Executes natural language processing inference to classify meeting reception into clear options (`Positive`, `Neutral`, `Negative`).
4. **`Extract Actions & Outcomes`**: Isolates commitments, scheduling follow-ups, and key strategic conclusions.
5. **`Edit/Update Interaction`**: Allows the conversational model to seamlessly modify or patch pre-populated fields through natural follow-up chat statements.

---

## 🛠️ Architecture & Tech Stack
- **Frontend:** React.js (Vite), Redux Toolkit (Global State Management), Tailwind CSS
- **Backend:** FastAPI (Python), Pydantic v2 (Strict Request Body Validation)
- **AI Agent Framework:** LangGraph (Stateful multi-node graph flows)
- **LLM Engine:** Llama 3.3 via the Groq Inference Cloud API
- **Database Layer:** SQLite with SQLAlchemy Object-Relational Mapping

---

## 🏃‍♂️ Local Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- Python 3.10 or higher
- Node.js (v18 or higher) & npm

### 2. Backend Environment Configuration
1. Open a terminal window and navigate into the backend folder:
   ```bash
   cd backend