import React from 'react';
import { risk_df, fraud_df } from '../utils/mockData';

const CARD_CONFIGS = [
    { key: 'totalSellers', title: 'Total Sellers', dotColor: '#a1a1aa' },
    { key: 'highRisk', title: 'High Risk', dotColor: '#ef4444' },
    { key: 'mediumRisk', title: 'Medium Risk', dotColor: '#f59e0b' },
    { key: 'lowRisk', title: 'Low Risk', dotColor: '#10b981' },
    { key: 'confirmedFraud', title: 'Confirmed Fraud', dotColor: '#ef4444' },
    { key: 'suspiciousPairs', title: 'Suspicious Pairs', dotColor: '#8b5cf6' },
];

function MetricCard({ config, value, delay = 0 }) {
    return (
        <div
            className="glass-card hover-lift glow-border"
            style={{
                padding: '24px',
                animationDelay: `${delay}s`,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: config.dotColor }} />
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}>
                    {config.title}
                </div>
            </div>
            <div
                style={{
                    fontSize: '2rem',
                    fontWeight: 300,
                    fontFamily: "'Outfit', sans-serif",
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                }}
            >
                {value.toLocaleString()}
            </div>
        </div>
    );
}

export default function KPIGrid() {
    const totalSellers    = risk_df.length;
    const highRisk        = risk_df.filter(r => r.RISK_LEVEL === 'HIGH').length;
    const mediumRisk      = risk_df.filter(r => r.RISK_LEVEL === 'MEDIUM').length;
    const lowRisk         = risk_df.filter(r => r.RISK_LEVEL === 'LOW').length;
    const confirmedFraud  = risk_df.filter(r => r.FRAUD_FLAG === 1).length;
    const suspiciousPairs = fraud_df.length;

    const values = { totalSellers, highRisk, mediumRisk, lowRisk, confirmedFraud, suspiciousPairs };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
        }}>
            {CARD_CONFIGS.map((cfg, i) => (
                <MetricCard
                    key={cfg.key}
                    config={cfg}
                    value={values[cfg.key]}
                    delay={i * 0.05}
                />
            ))}
        </div>
    );
}
