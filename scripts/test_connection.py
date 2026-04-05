import snowflake.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def test_snowflake_connection():
    print("--- Testing Snowflake Connection ---")
    
    account = os.getenv('SNOWFLAKE_ACCOUNT')
    user = os.getenv('SNOWFLAKE_USER')
    password = os.getenv('SNOWFLAKE_PASSWORD')
    
    if not all([account, user, password]):
        print("[!] Error: Snowflake credentials missing in .env file.")
        print("    Please fill in SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, and SNOWFLAKE_PASSWORD.")
        return False

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
        print("[OK] Successfully connected to Snowflake!")
        
        cursor = conn.cursor()
        
        # Check if Neo4j App is available
        print("--- Checking Neo4j Graph Analytics App status ---")
        try:
            cursor.execute("SHOW APPLICATIONS LIKE 'NEO4J_GRAPH_ANALYTICS'")
            apps = cursor.fetchall()
            if apps:
                print("[OK] Neo4j Graph Analytics App is installed.")
            else:
                print("[!] Warning: Neo4j Graph Analytics App not found. Please install it from the Snowflake Marketplace.")
        except Exception as e:
            print(f"[!] Could not verify Neo4j App: {e}")

        # Check if tables exist
        print("--- Checking if Supply Chain tables exist ---")
        cursor.execute("SHOW TABLES LIKE 'SELLERS'")
        if cursor.fetchone():
            print("[OK] 'SELLERS' table exists.")
        else:
            print("[!] 'SELLERS' table missing. Run 'db/setup_snowflake_neo4j.sql' in Snowflake.")

        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_snowflake_connection()
