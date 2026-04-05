import React, { useState, useEffect } from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df as mock_risk_df } from '../utils/mockData';
import { fetchRiskSummary } from '../utils/api';

const DARK_BG   = 'transparent';
const GRID_CLR  = 'var(--border-subtle)';
const TEXT_CLR  = 'var(--text-secondary)';
const FONT_FAM  = "Inter, system-ui, sans-serif";

const cmap = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };

const DARK_LAYOUT = {
    paper_bgcolor: DARK_BG,
    plot_bgcolor:  DARK_BG,
    font:          { family: FONT_FAM, color: TEXT_CLR, size: 11 },
    xaxis: {
        gridcolor: GRID_CLR, zerolinecolor: 'transparent',
        tickfont: { color: TEXT_CLR },
    },
    yaxis: {
        gridcolor: GRID_CLR, zerolinecolor: 'transparent',
        tickfont: { color: TEXT_CLR },
    },
    legend: {
        orientation: 'h', y: -0.2,
        bgcolor: 'transparent',
        font: { color: TEXT_CLR, size: 11 },
    },
    margin: { t: 20, l: 40, r: 20, b: 50 },
    hoverlabel: {
        bgcolor: 'var(--bg-card)',
        bordercolor: 'var(--border-subtle)',
        font: { family: FONT_FAM, color: 'var(--text-primary)', size: 12 },
    },
};

function PlotCard({ title, data, layout, filename, height = 300 }) {
    const { ref, loading } = usePlotly(
        data,
        { ...DARK_LAYOUT, height, ...layout },
        { filename, scrollZoom: false, displayModeBar: false }
    );
    return (
        <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{
                margin: '0 0 16px 0', fontSize: '0.8rem', fontWeight: 500,
                color: 'var(--text-primary)', letterSpacing: '0.02em',
            }}>
                {title}
            </h3>

            <div style={{ position: 'relative', height: `${height}px` }}>
                {loading && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <ChartLoader />
                    </div>
                )}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function AnalyticsCharts({ isLive }) {
    const [riskData, setRiskData] = useState(mock_risk_df);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLive) {
            setRiskData(mock_risk_df);
            setLoading(false);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            const data = await fetchRiskSummary();
            if (data && data.length > 0) {
                setRiskData(data);
            }
            setLoading(false);
        };
        loadData();
    }, [isLive]);

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><ChartLoader /><ChartLoader /><ChartLoader /></div>;
    if (!riskData || riskData.length === 0)
        return <EmptyState message="No analytics data available." />;

    const getGroupedData = (key) => {
        const groups = {};
        riskData.forEach(r => {
            const groupKey = r[key] || 'Unknown';
            if (!groups[groupKey]) groups[groupKey] = { HIGH: 0, MEDIUM: 0, LOW: 0 };
            groups[groupKey][r.RISK_LEVEL] = (groups[groupKey][r.RISK_LEVEL] || 0) + 1;
        });
        return Object.keys(groups).map(k => ({ label: k, ...groups[k] }));
    };

    const platformData = getGroupedData('PLATFORM');
    const cityData     = getGroupedData('CITY');

    const communityMetrics = useMemo(() => {
        const groups = {};
        riskData.forEach(r => {
            const commId = r.LOUVAIN_COMMUNITY;
            if (commId === null || commId === undefined) return;
            if (!groups[commId]) groups[commId] = { id: commId, sellers: 0, totalRisk: 0, highRisk: 0 };
            groups[commId].sellers++;
            groups[commId].totalRisk += r.RISK_SCORE || 0;
            if (r.RISK_LEVEL === 'HIGH') groups[commId].highRisk++;
        });
        return Object.values(groups)
            .map(g => ({ ...g, avgRisk: g.totalRisk / g.sellers }))
            .sort((a, b) => b.avgRisk - a.avgRisk);
    }, [riskData]);

    const barTrace = (data, level) => ({
        x: data.map(d => d.label),
        y: data.map(d => d[level]),
        name: level,
        type: 'bar',
        marker: {
            color: cmap[level],
            line: { width: 0 },
        },
        hovertemplate: `<b>%{x}</b><br>${level}: %{y}<extra></extra>`,
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 16 }}>
            <PlotCard
                title="PageRank vs Risk Score"
                filename="pagerank-vs-risk"
                data={['HIGH', 'MEDIUM', 'LOW'].map(l => ({
                    x: riskData.filter(d => d.RISK_LEVEL === l).map(d => d.PAGERANK_SCORE),
                    y: riskData.filter(d => d.RISK_LEVEL === l).map(d => d.RISK_SCORE),
                    mode: 'markers',
                    name: l,
                    marker: { color: cmap[l], size: 8 },
                    text: riskData.filter(d => d.RISK_LEVEL === l).map(d => `${d.SELLER_NAME}<br>City: ${d.CITY}`),
                    hovertemplate: '<b>%{text}</b><br>PageRank: %{x:.4f}<br>Risk Score: %{y:.1f}<extra></extra>'
                }))}
                layout={{ 
                    xaxis: { title: 'PageRank Centrality' },
                    yaxis: { title: 'Risk Score' }
                }}
            />
            <PlotCard
                title="Risk Distribution by Platform"
                filename="risk-by-platform"
                data={['HIGH', 'MEDIUM', 'LOW'].map(l => barTrace(platformData, l))}
                layout={{ barmode: 'stack' }}
            />
            <PlotCard
                title="Risk by City"
                filename="risk-by-city"
                data={['HIGH', 'MEDIUM', 'LOW'].map(l => barTrace(cityData, l))}
                layout={{ barmode: 'stack' }}
            />
            <PlotCard
                title="Overall Risk Distribution"
                filename="risk-distribution"
                data={[{
                    values: ['HIGH', 'MEDIUM', 'LOW'].map(l => riskData.filter(d => d.RISK_LEVEL === l).length),
                    labels: ['HIGH', 'MEDIUM', 'LOW'],
                    type: 'pie',
                    hole: 0.6,
                    marker: {
                        colors: [cmap.HIGH, cmap.MEDIUM, cmap.LOW],
                        line: { color: 'var(--bg-card)', width: 2 },
                    },
                    textfont: { color: 'var(--text-primary)', size: 11 },
                    hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>%{percent}<extra></extra>',
                }]}
                layout={{ legend: { orientation: 'v', x: 0.8, y: 0.5 } }}
            />

            {/* Community Summary Table - Integrated directly here to match the Streamlit idea */}
            <div className="glass-card md:col-span-3 p-5" style={{ minWidth: '100%' }}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                    Community Risk Profile (Louvain Clusters)
                </h3>
                <div className="premium-table-container max-h-[300px] overflow-y-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Community ID</th>
                                <th>Sellers Count</th>
                                <th>Avg. Risk Score</th>
                                <th>High-Risk Sellers</th>
                                <th>Risk Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {communityMetrics.map((c) => (
                                <tr key={c.id}>
                                    <td className="font-bold text-[var(--text-primary)]"># {c.id}</td>
                                    <td className="text-[var(--text-secondary)]">{c.sellers}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-[var(--bg-deep)] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-red-500" 
                                                    style={{ width: `${Math.min(100, (c.avgRisk / 100) * 100)}%` }} 
                                                />
                                            </div>
                                            <span className="text-xs font-semibold">{c.avgRisk.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold ${c.highRisk > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {c.highRisk} High Risk
                                        </span>
                                    </td>
                                    <td className="text-[var(--text-muted)] text-[0.65rem] italic">
                                        {c.avgRisk > 60 ? 'CRITICAL CLUSTER' : 'ACTIVE'}
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
