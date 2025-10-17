import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_techmeme(url):
    """
    Scrape headlines from Techmeme
    
    Args:
        url: Techmeme URL
        
    Returns:
        List of normalized articles
    """
    articles = []
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Techmeme structure: items with class 'item'
        items = soup.find_all('div', class_='item')
        
        for item in items:
            # Find the main story link
            story_link = item.find('a', class_='ourh')
            if story_link:
                title = story_link.get_text(strip=True)
                link = story_link.get('href', '')
                
                # Make relative URLs absolute
                if link.startswith('/'):
                    link = f"https://www.techmeme.com{link}"
                
                article = {
                    'title': title,
                    'link': link,
                    'summary': '',
                    'source': 'Techmeme',
                    'published': datetime.now().isoformat(),
                    'type': 'scrape'
                }
                articles.append(article)
                
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
    
    return articles

def scrape_websites(urls):
    """
    Scrape multiple websites
    
    Args:
        urls: List of URLs to scrape
        
    Returns:
        List of normalized articles
    """
    all_articles = []
    
    for url in urls:
        if 'techmeme.com' in url:
            articles = scrape_techmeme(url)
            all_articles.extend(articles)
    
    return all_articles
