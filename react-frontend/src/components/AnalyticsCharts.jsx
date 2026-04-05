import React, { useState, useEffect, useMemo } from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df as mock_risk_df } from '../utils/mockData';
import { fetchRiskSummary } from '../utils/api';

const DARK_BG   = 'transparent';
const GRID_CLR  = 'rgba(255,255,255,0.08)';
const TEXT_CLR  = 'rgba(255,255,255,0.6)';
const FONT_FAM  = "Inter, system-ui, sans-serif";

const cmap = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };

const DARK_LAYOUT = {
    paper_bgcolor: DARK_BG,
    plot_bgcolor:  DARK_BG,
    font:          { family: FONT_FAM, color: TEXT_CLR, size: 11 },
    xaxis: { gridcolor: GRID_CLR, zeroline: false },
    yaxis: { gridcolor: GRID_CLR, zeroline: false },
    legend: { orientation: 'h', y: -0.2, bgcolor: 'transparent' },
    margin: { t: 30, l: 40, r: 20, b: 50 },
};

function PlotCard({ title, data, layout, height = 300 }) {
    const { ref, loading } = usePlotly(data, { ...DARK_LAYOUT, height, ...layout });
    return (
        <div className="glass-card p-5">
            <h3 className="text-[0.8rem] font-medium text-[var(--text-primary)] mb-4">{title}</h3>
            <div className="relative" style={{ height: `${height}px` }}>
                {loading && <div className="absolute inset-0 flex items-center justify-center"><ChartLoader /></div>}
                <div ref={ref} className="w-full h-full" />
            </div>
        </div>
    );
}

export default function AnalyticsCharts({ isLive }) {
    const [riskData, setRiskData] = useState(mock_risk_df || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLive) {
            setRiskData(mock_risk_df || []);
            setLoading(false);
            return;
        }
        const load = async () => {
            setLoading(true);
            const d = await fetchRiskSummary();
            if (d && Array.isArray(d)) setRiskData(d);
            setLoading(false);
        };
        load();
    }, [isLive]);

    const stats = useMemo(() => {
        const platformGroups = {};
        const cityGroups = {};
        const communityGroups = {};
        
        (riskData || []).forEach(r => {
            // Platform Stats
            const p = r.PLATFORM || 'Unknown';
            if (!platformGroups[p]) platformGroups[p] = { label: p, HIGH: 0, MEDIUM: 0, LOW: 0 };
            platformGroups[p][r.RISK_LEVEL] = (platformGroups[p][r.RISK_LEVEL] || 0) + 1;

            // City Stats
            const c = r.CITY || 'Unknown';
            if (!cityGroups[c]) cityGroups[c] = { label: c, HIGH: 0, MEDIUM: 0, LOW: 0 };
            cityGroups[c][r.RISK_LEVEL] = (cityGroups[c][r.RISK_LEVEL] || 0) + 1;

            // Community Stats
            const comm = r.LOUVAIN_COMMUNITY;
            if (comm !== null && comm !== undefined) {
                if (!communityGroups[comm]) communityGroups[comm] = { id: comm, sellers: 0, totalRisk: 0, highRisk: 0 };
                communityGroups[comm].sellers++;
                communityGroups[comm].totalRisk += (r.RISK_SCORE || 0);
                if (r.RISK_LEVEL === 'HIGH') communityGroups[comm].highRisk++;
            }
        });

        return {
            platform: Object.values(platformGroups),
            city: Object.values(cityGroups),
            communities: Object.values(communityGroups)
                .map(g => ({ ...g, avgRisk: g.sellers > 0 ? g.totalRisk / g.sellers : 0 }))
                .sort((a, b) => b.avgRisk - a.avgRisk)
        };
    }, [riskData]);

    if (loading) return <div className="p-8"><ChartLoader /></div>;
    if (!riskData.length) return <EmptyState />;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlotCard 
                    title="Risk Distribution by Platform"
                    data={['HIGH', 'MEDIUM', 'LOW'].map(lvl => ({
                        x: stats.platform.map(d => d.label),
                        y: stats.platform.map(d => d[lvl]),
                        name: lvl, type: 'bar', marker: { color: cmap[lvl] }
                    }))}
                    layout={{ barmode: 'stack' }}
                />
                <PlotCard 
                    title="Geographic Risk Concentration"
                    data={['HIGH', 'MEDIUM', 'LOW'].map(lvl => ({
                        x: stats.city.map(d => d.label),
                        y: stats.city.map(d => d[lvl]),
                        name: lvl, type: 'bar', marker: { color: cmap[lvl] }
                    }))}
                    layout={{ barmode: 'stack' }}
                />
            </div>

            <div className="glass-card p-6">
                <h3 className="text-[0.8rem] font-medium text-[var(--text-primary)] mb-6 uppercase tracking-wider">
                    Community Vulnerability Index
                </h3>
                <div className="premium-table-container max-h-[400px] overflow-y-auto w-full">
                    <table className="premium-table w-full">
                        <thead>
                            <tr>
                                <th>Cluster ID</th>
                                <th>Population</th>
                                <th>Avg Risk</th>
                                <th>Critical Nodes</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.communities.map(c => (
                                <tr key={c.id}>
                                    <td className="font-mono"># {c.id}</td>
                                    <td>{c.sellers} sellers</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-red-500" 
                                                    style={{ width: `${Math.min(100, c.avgRisk)}%` }} 
                                                />
                                            </div>
                                            <span className="text-xs">{c.avgRisk.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold ${c.highRisk > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {c.highRisk} High
                                        </span>
                                    </td>
                                    <td className="text-xs text-[var(--text-muted)] italic">
                                        {c.avgRisk > 60 ? 'Immediate Action' : 'Monitoring'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
