import lancedb
import pandas as pd
import os

# 1. Define the database path
DB_PATH = "lancedb_data"

# 2. Connect to the database globally
# This defines 'db' so that search_opportunities can see it
db = lancedb.connect(DB_PATH)

def search_opportunities(query_text):
    try:
        table = db.open_table("opportunities")
        df = table.to_pandas()
        
        # Fuzzy matching search
        search_term = query_text.lower().strip()
        mask = df['description'].str.lower().str.contains(search_term) | df['title'].str.lower().str.contains(search_term)
        results_df = df[mask] if not df[mask].empty else df.head(10)

        # Organize by individual category
        output = {
            "internships": results_df[results_df['category'] == 'internship'].to_dict(orient="records"),
            "events": results_df[results_df['category'] == 'event'].to_dict(orient="records"),
            "scholarships": results_df[results_df['category'] == 'scholarship'].to_dict(orient="records")
        }
        return output
    except Exception as e:
        print(f"Search error: {e}")
        return {"internships": [], "events": [], "scholarships": []}