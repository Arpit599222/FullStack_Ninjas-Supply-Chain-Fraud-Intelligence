import snowflake.connector
import os
from django.conf import settings

def get_snowflake_connection():
    """
    Establishes a connection to Snowflake using environment variables.
    """
    try:
        ctx = snowflake.connector.connect(
            user=os.getenv('SNOWFLAKE_USER'),
            password=os.getenv('SNOWFLAKE_PASSWORD'),
            account=os.getenv('SNOWFLAKE_ACCOUNT'),
            warehouse=os.getenv('SNOWFLAKE_WAREHOUSE', 'SUPPLY_WH'),
            database=os.getenv('SNOWFLAKE_DATABASE', 'SUPPLY_CHAIN_DB'),
            schema=os.getenv('SNOWFLAKE_SCHEMA', 'PUBLIC'),
            role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN')
        )
        return ctx
    except Exception as e:
        print(f"Error connecting to Snowflake: {e}")
        return None

def execute_query(query, params=None):
    """
    Executes a query and returns the results.
    """
    conn = get_snowflake_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return results
    except Exception as e:
        print(f"Query execution error: {e}")
        return None
    finally:
        conn.close()

def get_risk_summary():
    """
    Fetches real-time risk scoring data from Snowflake with a fallback to the raw SELLERS table.
    """
    # 1. Try to get full analytics from the dynamic table
    try:
        query = """
        SELECT 
            nodeId AS NODEID, seller_name AS SELLER_NAME, platform AS PLATFORM, 
            city AS CITY, return_rate AS RETURN_RATE, fraud_flag AS FRAUD_FLAG, 
            risk_score AS RISK_SCORE, risk_level AS RISK_LEVEL, 
            pagerank_score AS PAGERANK_SCORE, louvain_community AS LOUVAIN_COMMUNITY
        FROM SELLER_RISK_REALTIME 
        ORDER BY RISK_SCORE DESC 
        LIMIT 100
        """
        data = execute_query(query)
        if data: return data
    except:
        pass
    
    # 2. Fallback to raw SELLERS table if analytics aren't ready
    query = """
    SELECT 
        nodeId AS NODEID, seller_name AS SELLER_NAME, platform AS PLATFORM, 
        city AS CITY, return_rate AS RETURN_RATE, fraud_flag AS FRAUD_FLAG,
        (return_rate * 100) AS RISK_SCORE, -- Simple heuristic fallback
        CASE WHEN return_rate > 0.3 THEN 'HIGH' ELSE 'LOW' END AS RISK_LEVEL,
        0 AS PAGERANK_SCORE,
        0 AS LOUVAIN_COMMUNITY
    FROM SELLERS 
    LIMIT 100
    """
    return execute_query(query)

def get_network_graph():
    """
    Fetches seller-warehouse relationships for graph visualization.
    """
    query = """
    SELECT 
        SOURCENODEID, 
        TARGETNODEID, 
        ORDER_VALUE,
        ORDER_ID
    FROM ORDERS
    """
    return execute_query(query)

def get_fraud_alerts():
    """
    Fetches recent fraud alerts.
    """
    query = "SELECT * FROM FRAUD_ALERT_LOG ORDER BY ALERT_TIME DESC LIMIT 50"
    return execute_query(query)

def get_warehouses():
    """
    Fetches warehouse nodes for graph visualization.
    """
    query = "SELECT nodeId AS NODEID, warehouse_name AS WAREHOUSE_NAME, city AS CITY FROM WAREHOUSES_GRAPH"
    return execute_query(query)
