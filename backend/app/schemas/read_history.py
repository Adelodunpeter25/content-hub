from pydantic import BaseModel, Field
from typing import Optional

class ReadHistoryCreate(BaseModel):
    article_url: str = Field(..., min_length=1)
    article_title: Optional[str] = None
    article_source: Optional[str] = None
    article_category: Optional[str] = None
