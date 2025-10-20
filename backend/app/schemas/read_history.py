from pydantic import BaseModel, Field

class ReadHistoryCreate(BaseModel):
    article_url: str = Field(..., min_length=1)
