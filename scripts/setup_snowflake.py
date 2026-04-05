import snowflake.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def run_setup_sql():
    print("--- Starting Snowflake + Neo4j Setup ---")
    
    account = os.getenv('SNOWFLAKE_ACCOUNT')
    user = os.getenv('SNOWFLAKE_USER')
    password = os.getenv('SNOWFLAKE_PASSWORD')
    
    if not all([account, user, password]):
        print("[!] Error: Snowflake credentials missing in .env")
        return

    try:
        conn = snowflake.connector.connect(
            user=user,
            password=password,
            account=account,
            warehouse=os.getenv('SNOWFLAKE_WAREHOUSE', 'SUPPLY_WH'),
            database=os.getenv('SNOWFLAKE_DATABASE', 'SUPPLY_CHAIN_DB'),
            schema=os.getenv('SNOWFLAKE_SCHEMA', 'PUBLIC'),
            role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN')
        )
        cursor = conn.cursor()
        
        sql_file = 'db/setup_snowflake_neo4j.sql'
        if not os.path.exists(sql_file):
            print(f"[!] Error: {sql_file} not found.")
            return

        with open(sql_file, 'r') as f:
            sql = f.read()
        
        # Split by semicolon but ignore semicolons inside strings/blocks if possible
        # Simple split for now, assuming standard SQL formatting
        queries = sql.split(';')
        
        for q in queries:
            q = q.strip()
            if q:
                print(f"Running query: {q[:60]}...")
                try:
                    cursor.execute(q)
                except Exception as query_err:
                    print(f"  [!] Query Error (skipping): {query_err}")
        
        print("[OK] Snowflake + Neo4j Setup Complete!")
        conn.close()
        
    except Exception as e:
        print(f"[!] Connection Error: {e}")

if __name__ == "__main__":
    run_setup_sql()
