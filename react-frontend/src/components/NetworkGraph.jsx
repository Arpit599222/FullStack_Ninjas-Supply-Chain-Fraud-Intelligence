import React, { useMemo } from 'react';
import { usePlotly, downloadChartAsPNG, resetChartView } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df, wh_df, edges_df } from '../utils/mockData';

function NetworkPlot({ pos, sellerNodes, whNodes, edgeX, edgeY }) {
    const cmap = { HIGH: '#FF4444', MEDIUM: '#FFA500', LOW: '#44BB44' };

    const data = [
        {
            x: edgeX, y: edgeY, mode: 'lines',
            line: { width: 0.3, color: '#aaaaaa' },
            hoverinfo: 'none', name: 'Orders', showlegend: false,
        },
        {
            x: sellerNodes.map(n => pos[n.NODEID]?.[0]).filter(v => v != null),
            y: sellerNodes.map(n => pos[n.NODEID]?.[1]).filter(v => v != null),
            mode: 'markers', name: 'Sellers',
            marker: {
                size: sellerNodes.map(n => Math.max(7, n.PAGERANK_SCORE * 100 + 7)),
                color: sellerNodes.map(n => cmap[n.RISK_LEVEL] || '#44BB44'),
                line: { width: 0.5, color: 'white' },
            },
            text: sellerNodes.map(n =>
                `<b>${n.SELLER_NAME}</b><br>City: ${n.CITY}<br>Platform: ${n.PLATFORM}<br>` +
                `Risk: ${n.RISK_LEVEL} | Score: ${n.RISK_SCORE.toFixed(1)}<br>PageRank: ${n.PAGERANK_SCORE.toFixed(4)}`
            ),
            hoverinfo: 'text',
        },
        {
            x: whNodes.map(n => pos[n.NODEID]?.[0]).filter(v => v != null),
            y: whNodes.map(n => pos[n.NODEID]?.[1]).filter(v => v != null),
            mode: 'markers', name: 'Warehouses',
            marker: { size: 14, color: '#4488FF', symbol: 'diamond', line: { width: 1, color: 'white' } },
            text: whNodes.map(n => `<b>Warehouse ${n.NODEID}</b>`),
            hoverinfo: 'text',
        },
    ];

    const layout = {
        dragmode: 'pan',
        showlegend: true, hovermode: 'closest', height: 600,
        margin: { l: 10, r: 10, t: 10, b: 10 },
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false },
        paper_bgcolor: '#0d1117', plot_bgcolor: '#0d1117',
        font: { color: 'white' },
        legend: { bgcolor: '#1a1a2e', bordercolor: '#444' },
    };

    const { ref, loading } = usePlotly(data, layout, {
        scrollZoom: true,
        filename: 'supply-chain-network',
        modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio', 'lasso2d'],
    });

    return (
        <div>
            {/* Controls row above chart — no absolute positioning */}
            <div className="flex justify-end gap-2 mb-2">
                <button
                    onClick={() => resetChartView(ref)}
                    className="px-3 py-1.5 text-xs bg-[#1a1a2e] border border-gray-600 text-gray-300 rounded hover:bg-[#2a2a4e] transition-colors"
                    title="Reset View"
                >⟳ Reset View</button>
                <button
                    onClick={() => downloadChartAsPNG(ref, 'supply-chain-network')}
                    className="px-3 py-1.5 text-xs bg-[#1a1a2e] border border-gray-600 text-gray-300 rounded hover:bg-[#2a2a4e] transition-colors"
                    title="Download as PNG"
                >⬇ Download PNG</button>
            </div>
            <div className="relative" style={{ height: '600px' }}>
                {loading && (
                    <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                        <ChartLoader />
                    </div>
                )}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function NetworkGraph() {
    if (!risk_df || risk_df.length === 0) return <EmptyState message="No seller data available." />;

    const pos = useMemo(() => {
        const p = {};
        [...risk_df, ...wh_df].forEach(node => {
            p[node.NODEID] = [Math.random() * 10 - 5, Math.random() * 10 - 5];
        });
        return p;
    }, []);

    const edgeX = [], edgeY = [];
    edges_df.forEach(e => {
        const s = pos[e.SOURCENODEID], t = pos[e.TARGETNODEID];
        if (s && t) { edgeX.push(s[0], t[0], null); edgeY.push(s[1], t[1], null); }
    });

    return (
        <div className="bg-[#0d1117] rounded-lg">
            <h2 className="text-xl font-bold mb-1">Supply Chain Network — Seller → Warehouse</h2>
            <p className="text-sm text-gray-400 mb-3">
                Node size = PageRank | Color = Risk level | Diamond = Warehouse
                &nbsp;·&nbsp;<span className="text-blue-400">Scroll to zoom · Drag to pan</span>
            </p>
            <NetworkPlot
                pos={pos}
                sellerNodes={risk_df.slice(0, 80)}
                whNodes={wh_df}
                edgeX={edgeX}
                edgeY={edgeY}
            />
        </div>
    );
}
