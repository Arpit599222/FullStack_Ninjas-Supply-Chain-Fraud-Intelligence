import snowflake.connector
import os
import random
from snowflake.connector.pandas_tools import write_pandas
import pandas as pd
from datetime import datetime, timedelta

# Mock platforms and cities to match frontend
platforms = ['Amazon', 'Flipkart']
cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']

def generate_mock_data(n_sellers=400, n_warehouses=30, n_orders=1500):
    """
    Generates a high-fidelity dataset for Snowflake testing.
    """
    # 1. Sellers
    sellers = []
    for i in range(n_sellers):
        return_rate = random.uniform(0.01, 0.40)
        fraud_flag = 1 if random.random() > 0.9 else 0
        sellers.append({
            'NODEID': i + 1,
            'SELLER_NAME': f'Seller {i + 1} Enterprise',
            'PLATFORM': random.choice(platforms),
            'CITY': random.choice(cities),
            'GST_NUMBER': f'GST{random.randint(100000, 999999)}',
            'BANK_ACCOUNT': f'BNK{str(random.randint(111111, 999999)).zfill(6)}',
            'RETURN_RATE': return_rate,
            'REG_DAYS_AGO': random.randint(30, 1000),
            'FRAUD_FLAG': fraud_flag
        })
    df_sellers = pd.DataFrame(sellers)

    # 2. Warehouses
    warehouses = []
    for i in range(n_warehouses):
        warehouses.append({
            'NODEID': i + 5001,
            'WAREHOUSE_NAME': f'WH-{random.choice(cities)[:3].upper()}-{i}',
            'CITY': random.choice(cities),
            'PIN_CODE': str(random.randint(111111, 999999))
        })
    df_warehouses = pd.DataFrame(warehouses)

    # 3. Orders (Edges)
    orders = []
    for i in range(n_orders):
        orders.append({
            'SOURCENODEID': random.choice(sellers)['NODEID'],
            'TARGETNODEID': random.choice(warehouses)['NODEID'],
            'ORDER_ID': f'ORD-{random.randint(100000, 999999)}',
            'ORDER_VALUE': random.uniform(500, 50000),
            'DELIVERY_DELAY': random.randint(0, 5),
            'RETURN_CLAIMED': 1 if random.random() > 0.8 else 0,
            'ROUTE_DEVIATION': 1 if random.random() > 0.95 else 0
        })
    df_orders = pd.DataFrame(orders)

    return df_sellers, df_warehouses, df_orders

def populate_snowflake():
    """
    Pushes mock data to Snowflake tables.
    """
    account = os.getenv('SNOWFLAKE_ACCOUNT')
    user = os.getenv('SNOWFLAKE_USER')
    password = os.getenv('SNOWFLAKE_PASSWORD')

    if not all([account, user, password]):
        print("❌ Snowflake credentials missing in .env. Please fill them first.")
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
        
        df_sellers, df_warehouses, df_orders = generate_mock_data()

        print(f"🚀 Ingesting {len(df_sellers)} Sellers...")
        write_pandas(conn, df_sellers, 'SELLERS', auto_create_table=True, overwrite=True)

        print(f"🚀 Ingesting {len(df_warehouses)} Warehouses...")
        write_pandas(conn, df_warehouses, 'WAREHOUSES', auto_create_table=True, overwrite=True)

        print(f"🚀 Ingesting {len(df_orders)} Orders...")
        write_pandas(conn, df_orders, 'ORDERS', auto_create_table=True, overwrite=True)

        print("✅ Data ingestion complete! You can now run the Graph Analytics script.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    populate_snowflake()
