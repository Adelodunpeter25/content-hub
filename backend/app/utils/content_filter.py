"""Content filtering utilities to remove unwanted articles"""
import re
from typing import List, Dict

# Explicit content keywords to filter out
EXPLICIT_KEYWORDS = [
    'sex', 'porn', 'xxx', 'adult', 'nsfw', 'nude', 'naked', 'erotic',
    'sexual', 'sexy', 'dating', 'hookup', 'escort', 'webcam'
]

# Non-English language patterns (common words/characters)
NON_ENGLISH_PATTERNS = [
    # Greek
    r'[\u0370-\u03FF]',
    # Cyrillic
    r'[\u0400-\u04FF]',
    # Arabic
    r'[\u0600-\u06FF]',
    # Chinese/Japanese/Korean
    r'[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]',
    # Hebrew
    r'[\u0590-\u05FF]',
    # Thai
    r'[\u0E00-\u0E7F]',
    # Devanagari (Hindi)
    r'[\u0900-\u097F]',
]

# Common non-English words (Spanish, Portuguese, French, German, etc.)
NON_ENGLISH_WORDS = [
    # Spanish/Portuguese
    'de', 'la', 'el', 'los', 'las', 'una', 'para', 'con', 'por', 'como', 'que', 'más',
    'computación', 'nube', 'está', 'transformando', 'mundo', 'visão', 'faça', 'casa',
    'maneiras', 'extrair', 'requisitos', 'claros', 'stakeholders', 'indecisos',
    # French
    'le', 'les', 'une', 'des', 'dans', 'sur', 'avec', 'pour', 'est', 'sont',
    # German
    'der', 'die', 'das', 'und', 'ist', 'sind', 'mit', 'für', 'von', 'zu',
    # Italian
    'il', 'lo', 'gli', 'della', 'degli', 'delle', 'alla', 'agli', 'alle',
]

def contains_explicit_content(text: str) -> bool:
    """
    Check if text contains explicit/adult content
    
    Args:
        text: Text to check (title or summary)
        
    Returns:
        True if explicit content detected
    """
    text_lower = text.lower()
    
    # Check for explicit keywords
    for keyword in EXPLICIT_KEYWORDS:
        if re.search(r'\b' + keyword + r'\b', text_lower):
            return True
    
    return False

def is_non_english(text: str) -> bool:
    """
    Detect if text is primarily non-English
    
    Args:
        text: Text to check (title or summary)
        
    Returns:
        True if text appears to be non-English
    """
    # Check for non-Latin scripts
    for pattern in NON_ENGLISH_PATTERNS:
        if re.search(pattern, text):
            return True
    
    # Check for common non-English words
    # Split text into words and check if many are non-English
    words = re.findall(r'\b\w+\b', text.lower())
    if len(words) < 3:
        return False  # Too short to determine
    
    non_english_count = sum(1 for word in words if word in NON_ENGLISH_WORDS)
    
    # If more than 30% of words are non-English, flag it
    if len(words) > 0 and (non_english_count / len(words)) > 0.3:
        return True
    
    # Check for Spanish/Portuguese specific patterns
    spanish_portuguese_patterns = [
        r'ción\b',  # -ción ending (Spanish)
        r'ão\b',    # -ão ending (Portuguese)
        r'ões\b',   # -ões ending (Portuguese)
        r'á|é|í|ó|ú|ã|õ',  # Accented characters common in Spanish/Portuguese
    ]
    
    accent_count = sum(1 for pattern in spanish_portuguese_patterns if re.search(pattern, text.lower()))
    if accent_count >= 2:
        return True
    
    return False

def should_filter_article(article: Dict) -> bool:
    """
    Determine if an article should be filtered out
    
    Args:
        article: Article dictionary with title and summary
        
    Returns:
        True if article should be filtered out
    """
    title = article.get('title', '')
    summary = article.get('summary', '')
    combined_text = f"{title} {summary}"
    
    # Filter explicit content
    if contains_explicit_content(combined_text):
        return True
    
    # Filter non-English content
    if is_non_english(combined_text):
        return True
    
    return False

def filter_articles(articles: List[Dict]) -> List[Dict]:
    """
    Filter out unwanted articles from a list
    
    Args:
        articles: List of article dictionaries
        
    Returns:
        Filtered list of articles
    """
    filtered = []
    filtered_count = 0
    
    for article in articles:
        if should_filter_article(article):
            filtered_count += 1
            # Log what was filtered (for debugging)
            title = article.get('title', 'No title')
            print(f"Filtered: {title[:50]}...")
        else:
            filtered.append(article)
    
    if filtered_count > 0:
        print(f"Filtered out {filtered_count} articles (explicit/non-English content)")
    
    return filtered
