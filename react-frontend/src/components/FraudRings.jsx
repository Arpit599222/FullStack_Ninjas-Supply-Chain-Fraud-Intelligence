import React, { useMemo } from 'react';
import { usePlotly, downloadChartAsPNG, resetChartView } from '../utils/usePlotly';
import { ChartLoader, EmptyState, ExportButtons } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import { risk_df, fraud_df } from '../utils/mockData';

const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'];

function FraudNetworkPlot({ pos2, fraudSellers, edgeX2, edgeY2 }) {
    const data = [
        {
            x: edgeX2, y: edgeY2, mode: 'lines',
            line: { width: 1.5, color: '#FF4444' }, hoverinfo: 'none', showlegend: false,
        },
        {
            x: fraudSellers.map(n => pos2[n.NODEID]?.[0]).filter(v => v != null),
            y: fraudSellers.map(n => pos2[n.NODEID]?.[1]).filter(v => v != null),
            mode: 'markers+text',
            marker: {
                size: 14,
                color: fraudSellers.map(n => colors[n.LOUVAIN_COMMUNITY % 10]),
                line: { width: 1, color: 'white' },
            },
            text: fraudSellers.map(n => n.SELLER_NAME.substring(0, 14)),
            textposition: 'top center',
            textfont: { size: 7, color: 'white' },
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
        paper_bgcolor: '#0d1117', plot_bgcolor: '#0d1117',
        font: { color: 'white' }, showlegend: false,
        margin: { l: 5, r: 5, t: 5, b: 5 },
    };
    const { ref, loading } = usePlotly(data, layout, { scrollZoom: true, filename: 'fraud-rings' });
    return (
        <div>
            {/* Controls row above chart — no absolute positioning */}
            <div className="flex justify-end gap-2 mb-2">
                <button onClick={() => resetChartView(ref)} className="px-3 py-1.5 text-xs bg-[#1a1a2e] border border-gray-600 text-gray-300 rounded hover:bg-[#2a2a4e] transition-colors" title="Reset View">⟳ Reset View</button>
                <button onClick={() => downloadChartAsPNG(ref, 'fraud-rings')} className="px-3 py-1.5 text-xs bg-[#1a1a2e] border border-gray-600 text-gray-300 rounded hover:bg-[#2a2a4e] transition-colors" title="Download PNG">⬇ Download PNG</button>
            </div>
            <div className="relative" style={{ height: '500px' }}>
                {loading && <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center"><ChartLoader /></div>}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function FraudRings() {
    const fraudSellers = risk_df.filter(r => r.FRAUD_FLAG === 1);

    const pos2 = useMemo(() => {
        const p = {};
        fraudSellers.forEach(n => { p[n.NODEID] = [Math.random() * 10 - 5, Math.random() * 10 - 5]; });
        return p;
    }, []);

    const edgeX2 = [], edgeY2 = [];
    fraud_df.forEach(e => {
        const s = pos2[e.SOURCENODEID], t = pos2[e.TARGETNODEID];
        if (s && t) { edgeX2.push(s[0], t[0], null); edgeY2.push(s[1], t[1], null); }
    });

    const rings = useMemo(() => {
        const map = {};
        risk_df.forEach(r => {
            if (!map[r.WCC_ENTITY]) map[r.WCC_ENTITY] = { accounts: 0, fraudCount: 0, avgReturn: 0, names: [], entity: r.WCC_ENTITY };
            map[r.WCC_ENTITY].accounts++;
            map[r.WCC_ENTITY].fraudCount += r.FRAUD_FLAG;
            map[r.WCC_ENTITY].avgReturn += r.RETURN_RATE;
            if (map[r.WCC_ENTITY].names.length < 3) map[r.WCC_ENTITY].names.push(r.SELLER_NAME);
        });
        return Object.values(map)
            .filter(r => r.accounts > 1)
            .map(r => ({ WCC_Entity: r.entity, Accounts: r.accounts, Fraud_Count: r.fraudCount, Avg_Return: parseFloat((r.avgReturn / r.accounts).toFixed(4)), Names: r.names.join(' | ') }))
            .sort((a, b) => b.Fraud_Count - a.Fraud_Count);
    }, []);

    if (fraudSellers.length === 0) return <EmptyState message="No fraud sellers detected." />;

    return (
        <div>
            <h2 className="text-xl font-bold mb-1">Fraud Ring Network — WCC Entity Resolution</h2>
            <p className="text-sm text-gray-400 mb-4">Sellers sharing the same bank account — each cluster = one real entity &nbsp;·&nbsp;<span className="text-blue-400">Scroll to zoom · Drag to pan</span></p>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-[3] bg-[#0d1117] rounded-lg border border-gray-800">
                    <FraudNetworkPlot pos2={pos2} fraudSellers={fraudSellers} edgeX2={edgeX2} edgeY2={edgeY2} />
                </div>
                <div className="flex-[2]">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h3 className="font-bold">Duplicate Seller Groups</h3>
                        <ExportButtons
                            onCSV={() => downloadCSV(rings, 'fraud-rings')}
                            onExcel={() => downloadExcel(rings, 'fraud-rings', 'Fraud Rings')}
                            onPDF={() => downloadPDF(rings, 'fraud-rings', 'Fraud Ring Groups')}
                        />
                    </div>
                    <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 px-4 py-2 rounded-md mb-3 text-sm font-medium">
                        ⚠ {rings.length} duplicate identity groups detected
                    </div>
                    <div className="overflow-auto h-[420px] bg-[#1a1a2e] border border-gray-800 rounded-lg">
                        {rings.length === 0 ? <EmptyState message="No duplicate groups found." /> : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#242440] text-gray-300 sticky top-0">
                                    <tr>
                                        <th className="p-3">WCC Entity</th><th className="p-3">Accounts</th>
                                        <th className="p-3">Fraud</th><th className="p-3">Names</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rings.map((r, i) => (
                                        <tr key={i} className="border-b border-gray-800 hover:bg-[#202035]">
                                            <td className="p-3">{r.WCC_Entity}</td><td className="p-3">{r.Accounts}</td>
                                            <td className="p-3">{r.Fraud_Count}</td><td className="p-3 text-gray-400 text-xs">{r.Names}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
