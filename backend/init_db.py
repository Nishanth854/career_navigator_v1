import pandas as pd
import lancedb
from lancedb.embeddings import get_registry
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def initialize_opportunities():
    csv_file = 'student_opportunities_dataset.csv'
    db_path = "lancedb_data"

    print(f"--- Starting Database Initialization ---")

    # 1. Check if CSV exists
    if not os.path.exists(csv_file):
        print(f"❌ ERROR: Could not find {csv_file} in the current folder.")
        print(f"Files currently in this folder: {os.listdir('.')}")
        return

    try:
        # 2. Connect to LanceDB
        db = lancedb.connect(db_path)
        
        # 3. Load Data
        print(f"📂 Reading CSV file...")
        df = pd.read_csv(csv_file)
        print(f"✅ Found {len(df)} entries in CSV.")

        # 4. Set up the Embedding Model
        # Using a simple, fast model for testing
        model = get_registry().get("sentence-transformers").create(name="all-MiniLM-L6-v2")

        # 5. Create the Table
        print(f"🧠 Vectorizing data and creating 'opportunities' table...")
        table = db.create_table("opportunities", data=df, mode="overwrite")
        
        print(f"🚀 SUCCESS! {len(df)} opportunities loaded into {db_path}.")
        
    except Exception as e:
        print(f"❌ AN ERROR OCCURRED: {e}")

if __name__ == "__main__":
    initialize_opportunities()