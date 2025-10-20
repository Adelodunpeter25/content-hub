from pydantic import BaseModel, Field
from typing import Optional

class BookmarkCreate(BaseModel):
    article_url: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    source: Optional[str] = None
