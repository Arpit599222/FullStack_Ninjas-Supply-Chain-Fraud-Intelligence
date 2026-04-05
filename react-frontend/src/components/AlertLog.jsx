import React, { useState, useEffect } from 'react';
import { fetchAlerts } from '../utils/api';
import { ChartLoader, EmptyState } from './shared';

export default function AlertLog({ isLive }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockAlerts = [
        { ALERT_TIME: new Date().toISOString(), SELLER_NAME: 'Global Logistics Corp', RISK_SCORE: 94.2, CITY: 'Mumbai', PLATFORM: 'Amazon', ALERT_TYPE: 'SUDDEN_RISK_SURGE' },
        { ALERT_TIME: new Date(Date.now() - 3600000).toISOString(), SELLER_NAME: 'FastTrack Electronics', RISK_SCORE: 88.5, CITY: 'Delhi', PLATFORM: 'Flipkart', ALERT_TYPE: 'HIGH_RETURN_PATTERN' },
        { ALERT_TIME: new Date(Date.now() - 7200000).toISOString(), SELLER_NAME: 'Prime Wholesale', RISK_SCORE: 91.0, CITY: 'Bangalore', PLATFORM: 'Amazon', ALERT_TYPE: 'SHARED_BANK_IDENTITY' },
    ];

    useEffect(() => {
        if (!isLive) {
            setAlerts(mockAlerts);
            setLoading(false);
            return;
        }

        const loadAlerts = async () => {
            setLoading(true);
            const data = await fetchAlerts();
            if (data && data.length > 0) {
                setAlerts(data);
            }
            setLoading(false);
        };
        loadAlerts();
    }, [isLive]);

    if (loading) return <div className="bg-[var(--bg-card)] p-8 rounded-lg flex items-center justify-center"><ChartLoader /></div>;
    if (!alerts || alerts.length === 0) return <EmptyState message="No recent high-risk activities detected. Real-time stream monitoring is active." />;

    return (
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Fraud Alert Log</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Historical log of high-risk sellers flagged by the Snowflake Dynamic Alert system.</p>
                </div>
                <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-semibold animate-pulse border border-red-500/20">
                    Live Monitoring Active
                </div>
            </div>

            <div className="premium-table-container max-h-[600px] overflow-y-auto">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Seller</th>
                            <th>Risk Score</th>
                            <th>City</th>
                            <th>Platform</th>
                            <th>Alert Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert, i) => (
                            <tr key={i} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                                <td className="text-[var(--text-muted)] text-xs">
                                    {new Date(alert.ALERT_TIME).toLocaleString()}
                                </td>
                                <td className="font-medium text-[var(--text-primary)]">
                                    {alert.SELLER_NAME}
                                </td>
                                <td>
                                    <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[0.7rem] font-bold">
                                        {parseFloat(alert.RISK_SCORE || 0).toFixed(1)}
                                    </span>
                                </td>
                                <td className="text-[var(--text-secondary)]">{alert.CITY}</td>
                                <td className="text-[var(--text-secondary)]">{alert.PLATFORM}</td>
                                <td>
                                    <span className="text-xs text-[var(--text-muted)] italic">
                                        {alert.ALERT_TYPE || 'NEW_HIGH_RISK'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
