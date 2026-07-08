from pydantic import BaseModel
from typing import Optional

# This schema enforces the exact naming contract between React and FastAPI
class InteractionCreate(BaseModel):
    hcp_name: str
    interaction_type: str
    date: str
    time: str
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    sentiment: str = "Neutral"
    outcomes: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

    class Config:
        from_attributes = True