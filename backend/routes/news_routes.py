from fastapi import APIRouter, Query
import feedparser
from datetime import datetime

router = APIRouter()

@router.get("/news")
async def get_latest_news(category: str = Query("education", description="Category of news")):
    try:
        search_terms = {
            "education": "education+schemes+india",
            "subsidies": "government+subsidy+schemes+india",
            "scholarships": "student+scholarships+india"
        }
        term = search_terms.get(category.lower(), "education+schemes+india")
        rss_url = f"https://news.google.com/rss/search?q={term}&hl=en-IN&gl=IN&ceid=IN:en"
        
        # Parse the RSS feed
        feed = feedparser.parse(rss_url)
        articles = []
        
        # Extract the top 10 articles
        for entry in feed.entries[:10]:
            # Clean up the publisher name (usually in the title after " - ")
            title_parts = entry.title.rsplit(" - ", 1)
            clean_title = title_parts[0] if len(title_parts) > 1 else entry.title
            publisher = title_parts[1] if len(title_parts) > 1 else "Google News"
            
            articles.append({
                "title": clean_title,
                "link": entry.link,
                "published_date": entry.published,
                "publisher": publisher,
                "description": entry.description
            })
            
        return {"status": "success", "articles": articles}
    except Exception as e:
        print(f"Error fetching news: {e}")
        return {"status": "error", "message": "Failed to fetch news", "articles": []}
