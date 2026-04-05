import React, { useMemo, useState, useEffect } from 'react';
import { usePlotly, downloadChartAsPNG, resetChartView } from '../utils/usePlotly';
import { ChartLoader, EmptyState, ExportButtons } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import { risk_df as mock_risk_df, fraud_df as mock_fraud_df } from '../utils/mockData';
import { fetchRiskSummary } from '../utils/api';

const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'];

function FraudNetworkPlot({ pos2, fraudSellers, edgeX2, edgeY2 }) {
    const data = [
        {
            x: edgeX2, y: edgeY2, mode: 'lines',
            line: { width: 1.5, color: '#ef4444' }, hoverinfo: 'none', showlegend: false,
        },
        {
            x: fraudSellers.map(n => pos2[n.NODEID]?.[0]).filter(v => v != null),
            y: fraudSellers.map(n => pos2[n.NODEID]?.[1]).filter(v => v != null),
            mode: 'markers+text',
            marker: {
                size: 14,
                color: fraudSellers.map(n => colors[n.LOUVAIN_COMMUNITY % 10]),
                line: { width: 0 },
            },
            text: fraudSellers.map(n => n.SELLER_NAME.substring(0, 14)),
            textposition: 'top center',
            textfont: { size: 10, color: '#a1a1aa' },
            hovertext: fraudSellers.map(n =>
                `<b>${n.SELLER_NAME}</b><br>Platform: ${n.PLATFORM}<br>City: ${n.CITY}<br>Community: ${n.LOUVAIN_COMMUNITY}`
            ),
            hoverinfo: 'text', name: 'Fraud Sellers',
        },
    ];
    const layout = {
        dragmode: 'pan', height: 500, hovermode: 'closest',
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false },
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
        font: { color: '#f4f4f5', family: 'Inter, system-ui, sans-serif' }, showlegend: false,
        margin: { l: 5, r: 5, t: 5, b: 5 },
        hoverlabel: {
            bgcolor: 'rgba(20,20,22,0.95)',
            bordercolor: 'rgba(255,255,255,0.1)',
            font: { family: "Inter, system-ui, sans-serif", color: '#f4f4f5', size: 12 },
        },
    };
    const { ref, loading } = usePlotly(data, layout, { scrollZoom: true, filename: 'fraud-rings', displayModeBar: false });
    
    return (
        <div className="glass-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
                <button onClick={() => resetChartView(ref)} 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: 4, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >⟳ Reset View</button>
                <button onClick={() => downloadChartAsPNG(ref, 'fraud-rings')} 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: 4, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >⬇ Download PNG</button>
            </div>
            <div style={{ position: 'relative', height: '500px' }}>
                {loading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChartLoader /></div>}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function FraudRings({ isLive }) {
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

    const fraudSellers = useMemo(() => riskData.filter(r => r.FRAUD_FLAG === 1), [riskData]);

    const pos2 = useMemo(() => {
        const p = {};
        fraudSellers.forEach(n => { p[n.NODEID] = [Math.random() * 10 - 5, Math.random() * 10 - 5]; });
        return p;
    }, [fraudSellers]);

    const edgeX2 = [], edgeY2 = [];
    mock_fraud_df.forEach(e => {
        const s = pos2[e.SOURCENODEID], t = pos2[e.TARGETNODEID];
        if (s && t) { edgeX2.push(s[0], t[0], null); edgeY2.push(s[1], t[1], null); }
    });

    const rings = useMemo(() => {
        const map = {};
        riskData.forEach(r => {
            if (!map[r.WCC_ENTITY]) map[r.WCC_ENTITY] = { accounts: 0, fraudCount: 0, avgReturn: 0, names: [], entity: r.WCC_ENTITY };
            map[r.WCC_ENTITY].accounts++;
            map[r.WCC_ENTITY].fraudCount += r.FRAUD_FLAG || 0;
            map[r.WCC_ENTITY].avgReturn += r.RETURN_RATE || 0;
            if (map[r.WCC_ENTITY].names.length < 3) map[r.WCC_ENTITY].names.push(r.SELLER_NAME);
        });
        return Object.values(map)
            .filter(r => r.accounts > 1)
            .map(r => ({ WCC_Entity: r.entity, Accounts: r.accounts, Fraud_Count: r.fraudCount, Avg_Return: parseFloat((r.avgReturn / r.accounts).toFixed(4)), Names: r.names.join(' | ') }))
            .sort((a, b) => b.Fraud_Count - a.Fraud_Count);
    }, [riskData]);

    if (fraudSellers.length === 0) return <EmptyState message="No fraud sellers detected." />;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 600,
                    color: 'var(--text-primary)',
                }}>
                    Fraud Ring Network — Entity Resolution
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Sellers sharing identical hardware / banking details. Each cluster equals one true identity.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Visualizer takes full width here for better responsive behaviour, but we can do grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <div style={{ flex: '3 1 600px' }}>
                        <FraudNetworkPlot pos2={pos2} fraudSellers={fraudSellers} edgeX2={edgeX2} edgeY2={edgeY2} />
                    </div>
                    
                    <div style={{ flex: '2 1 350px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>Duplicate Groups</h3>
                            <ExportButtons
                                onCSV={() => downloadCSV(rings, 'fraud-rings')}
                                onExcel={() => downloadExcel(rings, 'fraud-rings', 'Fraud Rings')}
                                onPDF={() => downloadPDF(rings, 'fraud-rings', 'Fraud Ring Groups')}
                            />
                        </div>
                        
                        <div style={{ 
                            background: 'rgba(250, 204, 21, 0.1)', 
                            border: '1px solid rgba(250, 204, 21, 0.2)', 
                            color: '#facc15', 
                            padding: '12px 16px', 
                            borderRadius: 6, 
                            marginBottom: 16, 
                            fontSize: '0.8rem', 
                            fontWeight: 500 
                        }}>
                            ⚠ {rings.length} duplicate identity groups detected
                        </div>

                        <div className="premium-table-container" style={{ maxHeight: 420 }}>
                            {rings.length === 0 ? <EmptyState message="No duplicate groups found." /> : (
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>WCC Entity</th>
                                            <th>Accounts</th>
                                            <th>Fraud</th>
                                            <th>Names</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rings.map((r, i) => (
                                            <tr key={i}>
                                                <td>{r.WCC_Entity}</td>
                                                <td>{r.Accounts}</td>
                                                <td>{r.Fraud_Count}</td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{r.Names}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
