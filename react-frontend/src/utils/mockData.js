// mockData.js
// Simulating the Python Faker / Snowflake data with identical schemas

const platforms = ['Amazon', 'Flipkart'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];

const getRandomElem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

export const risk_df = Array.from({ length: 400 }, (_, i) => {
    const returnRate = getRandomFloat(0.01, 0.4);
    const pageRank = getRandomFloat(0.001, 0.05);
    const fraudFlag = Math.random() > 0.9 ? 1 : 0;
    
    const riskScore = (returnRate * 30) + (pageRank * 200) + (fraudFlag * 50);
    
    let riskLevel = 'LOW';
    if (riskScore > 60) riskLevel = 'HIGH';
    else if (riskScore > 30) riskLevel = 'MEDIUM';
    
    return {
        NODEID: i + 1,
        SELLER_NAME: `Seller ${i + 1} Enterprise`,
        PLATFORM: getRandomElem(platforms),
        CITY: getRandomElem(cities),
        RISK_LEVEL: riskLevel,
        RISK_SCORE: riskScore,
        PAGERANK_SCORE: pageRank,
        LOUVAIN_COMMUNITY: Math.floor(Math.random() * 10) + 1,
        WCC_ENTITY: Math.floor(Math.random() * 100) + 1,
        RETURN_RATE: returnRate,
        FRAUD_FLAG: fraudFlag,
        LAST_REFRESHED: new Date().toISOString(),
        BANK_ACCOUNT: `BNK${Math.floor(Math.random() * 5000).toString().padStart(6, '0')}`
    };
}).sort((a, b) => b.RISK_SCORE - a.RISK_SCORE);

export const alert_df = risk_df.filter(r => r.RISK_LEVEL === 'HIGH').map((r, i) => ({
    ...r,
    ALERT_TIME: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    ALERT_TYPE: 'NEW_HIGH_RISK'
})).slice(0, 50).sort((a, b) => new Date(b.ALERT_TIME) - new Date(a.ALERT_TIME));

export const wh_df = Array.from({ length: 30 }, (_, i) => ({
    NODEID: i + 5001,
    WAREHOUSE_NAME: `WH-${getRandomElem(cities).substring(0,3).toUpperCase()}-${i}`,
    CITY: getRandomElem(cities)
}));

export const edges_df = Array.from({ length: 1500 }, (_, i) => ({
    SOURCENODEID: getRandomElem(risk_df).NODEID,
    TARGETNODEID: getRandomElem(wh_df).NODEID,
    TOTAL_VALUE: getRandomFloat(1000, 50000),
    ORDER_VALUE: getRandomFloat(50, 1000),
    CNT: Math.floor(Math.random() * 100)
}));

export const fraud_df = Array.from({ length: 150 }, (_, i) => {
    return {
        SOURCENODEID: getRandomElem(risk_df.filter(r => r.FRAUD_FLAG === 1)).NODEID,
        TARGETNODEID: getRandomElem(risk_df.filter(r => r.FRAUD_FLAG === 1)).NODEID
    }
});
