import React from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState, ExportButtons, RiskBadge } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import { risk_df } from '../utils/mockData';

const cmap = { HIGH: '#ef4444', MEDIUM: '#facc15', LOW: '#22c55e' };

function ScatterPlot() {
    const data = ['HIGH', 'MEDIUM', 'LOW'].map(lvl => {
        const filtered = risk_df.filter(r => r.RISK_LEVEL === lvl);
        return {
            x: filtered.map(r => r.PAGERANK_SCORE),
            y: filtered.map(r => r.RISK_SCORE),
            mode: 'markers', type: 'scatter', name: lvl,
            marker: { 
                size: filtered.map(r => Math.max(5, r.RISK_SCORE / 5)), 
                color: cmap[lvl],
                line: { width: 0 }
            },
            text: filtered.map(r => `${r.SELLER_NAME}<br>${r.CITY}<br>${r.PLATFORM}`),
            hoverinfo: 'text',
        };
    });
    
    // Updated Plotly theme configs to match minimal style
    const { ref, loading } = usePlotly(data, {
        xaxis: { 
            title: 'PageRank Score', 
            zeroline: false,
            gridcolor: 'rgba(255,255,255,0.06)',
            tickfont: { color: '#71717a' },
            titlefont: { color: '#a1a1aa' }
        },
        yaxis: { 
            title: 'Risk Score', 
            zeroline: false,
            gridcolor: 'rgba(255,255,255,0.06)',
            tickfont: { color: '#71717a' },
            titlefont: { color: '#a1a1aa' }
        },
        height: 480, 
        paper_bgcolor: 'transparent', 
        plot_bgcolor: 'transparent',
        hovermode: 'closest', 
        margin: { t: 20, l: 55, r: 20, b: 55 },
        legend: { font: { color: '#a1a1aa' } },
        hoverlabel: {
            bgcolor: 'rgba(20,20,22,0.95)',
            bordercolor: 'rgba(255,255,255,0.1)',
            font: { family: "Inter, system-ui, sans-serif", color: '#f4f4f5', size: 12 },
        },
    }, { scrollZoom: true, filename: 'pagerank-vs-risk', displayModeBar: false });

    return (
        <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{
                margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: 600,
                color: 'var(--text-primary)', letterSpacing: '0.02em',
            }}>
                PageRank Centrality vs Fraud Risk Score
            </h3>
            <div style={{ position: 'relative', height: '480px' }}>
                {loading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChartLoader /></div>}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function PageRankGraph() {
    if (!risk_df || risk_df.length === 0) return <EmptyState message="No data available." />;

    const topSellers = [...risk_df]
        .sort((a, b) => b.PAGERANK_SCORE - a.PAGERANK_SCORE)
        .slice(0, 10);

    const exportData = topSellers.map(s => ({
        Seller_Name: s.SELLER_NAME,
        Platform: s.PLATFORM,
        City: s.CITY,
        PageRank_Score: s.PAGERANK_SCORE.toFixed(4),
        Risk_Level: s.RISK_LEVEL,
        Risk_Score: s.RISK_SCORE.toFixed(1),
    }));

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 600,
                    color: 'var(--text-primary)',
                }}>
                    PageRank vs Risk Score
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Influential sellers identified using graph-based centrality. High PageRank + High Risk = Most dangerous target.
                </p>
            </div>
            
            <div style={{ marginBottom: 32 }}><ScatterPlot /></div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>Top 10 Sellers by PageRank</h3>
                <ExportButtons
                    onCSV={() => downloadCSV(exportData, 'top10-sellers-pagerank')}
                    onExcel={() => downloadExcel(exportData, 'top10-sellers-pagerank', 'Top Sellers')}
                    onPDF={() => downloadPDF(exportData, 'top10-sellers-pagerank', 'Top 10 Sellers by PageRank')}
                />
            </div>

            <div className="premium-table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Seller Name</th>
                            <th>Platform</th>
                            <th>City</th>
                            <th>PageRank</th>
                            <th>Risk Level</th>
                            <th>Risk Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topSellers.map((s, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 500 }}>{s.SELLER_NAME}</td>
                                <td>{s.PLATFORM}</td>
                                <td>{s.CITY}</td>
                                <td>{s.PAGERANK_SCORE.toFixed(4)}</td>
                                <td>
                                    <RiskBadge level={s.RISK_LEVEL} />
                                </td>
                                <td>{s.RISK_SCORE.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
