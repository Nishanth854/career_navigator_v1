import feedparser

RSS_URL = "https://news.google.com/rss/search?q=education+schemes+india&hl=en-IN&gl=IN&ceid=IN:en"
print(f"Fetching: {RSS_URL}")
feed = feedparser.parse(RSS_URL)

print(f"Status: {feed.get('status', 'no status')}")
print(f"Entries found: {len(feed.entries)}")

if len(feed.entries) > 0:
    entry = feed.entries[0]
    print(f"First Entry: {entry.title}")
else:
    print(f"Bozo Exception: {feed.get('bozo_exception')}")
