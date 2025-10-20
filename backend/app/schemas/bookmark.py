from pydantic import BaseModel, Field

class BookmarkCreate(BaseModel):
    article_url: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    source: str | None = None
