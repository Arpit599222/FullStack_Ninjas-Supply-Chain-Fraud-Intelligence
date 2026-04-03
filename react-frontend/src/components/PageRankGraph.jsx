import React from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState, ExportButtons } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import { risk_df } from '../utils/mockData';

const cmap = { HIGH: '#FF4444', MEDIUM: '#FFA500', LOW: '#44BB44' };

function ScatterPlot() {
    const data = ['HIGH', 'MEDIUM', 'LOW'].map(lvl => {
        const filtered = risk_df.filter(r => r.RISK_LEVEL === lvl);
        return {
            x: filtered.map(r => r.PAGERANK_SCORE),
            y: filtered.map(r => r.RISK_SCORE),
            mode: 'markers', type: 'scatter', name: lvl,
            marker: { size: filtered.map(r => Math.max(5, r.RISK_SCORE / 5)), color: cmap[lvl] },
            text: filtered.map(r => `${r.SELLER_NAME}<br>${r.CITY}<br>${r.PLATFORM}`),
            hoverinfo: 'text',
        };
    });
    const { ref, loading } = usePlotly(data, {
        xaxis: { title: 'PageRank Score', zeroline: false },
        yaxis: { title: 'Risk Score', zeroline: false },
        height: 480, paper_bgcolor: 'white', plot_bgcolor: 'white',
        hovermode: 'closest', margin: { t: 20, l: 55, r: 20, b: 55 },
    }, { scrollZoom: true, filename: 'pagerank-vs-risk' });

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-gray-800 font-bold mb-2 text-sm">PageRank Centrality vs Fraud Risk Score</h3>
            <div className="relative" style={{ height: '480px' }}>
                {loading && <div className="absolute inset-0 z-10 bg-white flex items-center justify-center"><ChartLoader /></div>}
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
            <h2 className="text-xl font-bold mb-1">PageRank vs Risk Score</h2>
            <p className="text-sm text-gray-400 mb-4">
                High PageRank + High Risk = most dangerous influential seller
                &nbsp;·&nbsp;<span className="text-blue-400">Scroll to zoom</span>
            </p>
            <div className="mb-6"><ScatterPlot /></div>

            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-bold">Top 10 Sellers by PageRank</h3>
                <ExportButtons
                    onCSV={() => downloadCSV(exportData, 'top10-sellers-pagerank')}
                    onExcel={() => downloadExcel(exportData, 'top10-sellers-pagerank', 'Top Sellers')}
                    onPDF={() => downloadPDF(exportData, 'top10-sellers-pagerank', 'Top 10 Sellers by PageRank')}
                />
            </div>

            <div className="overflow-auto bg-[#1a1a2e] border border-gray-800 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#242440] text-gray-300 sticky top-0">
                        <tr>
                            <th className="p-3">Seller Name</th><th className="p-3">Platform</th>
                            <th className="p-3">City</th><th className="p-3">PageRank</th>
                            <th className="p-3">Risk Level</th><th className="p-3">Risk Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topSellers.map((s, i) => (
                            <tr key={i} className="border-b border-gray-800 hover:bg-[#202035]">
                                <td className="p-3 font-medium">{s.SELLER_NAME}</td>
                                <td className="p-3">{s.PLATFORM}</td>
                                <td className="p-3">{s.CITY}</td>
                                <td className="p-3">{s.PAGERANK_SCORE.toFixed(4)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        s.RISK_LEVEL === 'HIGH' ? 'bg-red-900 text-red-300' :
                                        s.RISK_LEVEL === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                                    }`}>{s.RISK_LEVEL}</span>
                                </td>
                                <td className="p-3">{s.RISK_SCORE.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
