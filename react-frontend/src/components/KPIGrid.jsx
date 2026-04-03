import React from 'react';
import { risk_df, fraud_df } from '../utils/mockData';

export default function KPIGrid() {
    const totalSellers = risk_df.length;
    const highRisk = risk_df.filter(r => r.RISK_LEVEL === 'HIGH').length;
    const mediumRisk = risk_df.filter(r => r.RISK_LEVEL === 'MEDIUM').length;
    const lowRisk = risk_df.filter(r => r.RISK_LEVEL === 'LOW').length;
    const confirmedFraud = risk_df.filter(r => r.FRAUD_FLAG === 1).length;
    const suspiciousPairs = fraud_df.length;

    const MetricCard = ({ title, value }) => (
        <div className="bg-[#1a1a2e] border border-gray-800 p-4 rounded-lg shadow-sm
            transition-all duration-200 ease-out cursor-default
            hover:bg-[#22223a] hover:border-blue-700/60 hover:shadow-lg hover:-translate-y-1">
            <div className="text-sm text-gray-400 mb-1">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <MetricCard title="Total Sellers" value={totalSellers} />
            <MetricCard title="🔴 High Risk" value={highRisk} />
            <MetricCard title="🟡 Medium Risk" value={mediumRisk} />
            <MetricCard title="🟢 Low Risk" value={lowRisk} />
            <MetricCard title="Confirmed Fraud" value={confirmedFraud} />
            <MetricCard title="Suspicious Pairs" value={suspiciousPairs} />
        </div>
    );
}
