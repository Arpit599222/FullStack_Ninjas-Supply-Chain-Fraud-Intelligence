import React, { useMemo, useState, useEffect } from 'react';
import { usePlotly, downloadChartAsPNG, resetChartView } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df as mock_risk_df, wh_df as mock_wh_df, edges_df as mock_edges_df } from '../utils/mockData';
import { fetchRiskSummary, fetchNetworkGraph, fetchWarehouses } from '../utils/api';

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
                size: sellerNodes.map(n => Math.max(7, (n.PAGERANK_SCORE || 0) * 100 + 7)),
                color: sellerNodes.map(n => cmap[n.RISK_LEVEL] || '#44BB44'),
                line: { width: 0.5, color: 'white' },
            },
            text: sellerNodes.map(n =>
                `<b>${n.SELLER_NAME}</b><br>` +
                `City: ${n.CITY} | Platform: ${n.PLATFORM}<br>` +
                `Risk: ${n.RISK_LEVEL} (${(n.RISK_SCORE || 0).toFixed(1)})<br>` +
                `PageRank: ${(n.PAGERANK_SCORE || 0).toFixed(4)}<br>` +
                `Community: ${n.LOUVAIN_COMMUNITY || 'N/A'}`
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
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
        font: { color: 'var(--text-primary)' },
        legend: { bgcolor: 'var(--bg-card)', bordercolor: 'var(--border-subtle)', font: { color: 'var(--text-primary)' } },
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
                    className="px-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded hover:bg-[var(--bg-card-hover)] transition-colors"
                    title="Reset View"
                >⟳ Reset View</button>
                <button
                    onClick={() => downloadChartAsPNG(ref, 'supply-chain-network')}
                    className="px-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded hover:bg-[var(--bg-card-hover)] transition-colors"
                    title="Download as PNG"
                >⬇ Download PNG</button>
            </div>
            <div className="relative" style={{ height: '600px' }}>
                {loading && (
                    <div className="absolute inset-0 bg-[var(--bg-deep)] flex items-center justify-center">
                        <ChartLoader />
                    </div>
                )}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function NetworkGraph({ isLive }) {
    const [riskData, setRiskData] = useState(mock_risk_df);
    const [whData, setWhData] = useState(mock_wh_df);
    const [edgeData, setEdgeData] = useState(mock_edges_df);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLive) {
            setRiskData(mock_risk_df);
            setWhData(mock_wh_df);
            setEdgeData(mock_edges_df);
            setLoading(false);
            return;
        }

        const loadGraphData = async () => {
            setLoading(true);
            const [rData, nData, wData] = await Promise.all([
                fetchRiskSummary(), 
                fetchNetworkGraph(),
                fetchWarehouses()
            ]);
            if (rData && rData.length > 0) setRiskData(rData);
            if (nData && nData.length > 0) setEdgeData(nData);
            if (wData && wData.length > 0) setWhData(wData);
            setLoading(false);
        };
        loadGraphData();
    }, [isLive]);

    const pos = useMemo(() => {
        const p = {};
        [...riskData, ...whData].forEach(node => {
            p[node.NODEID] = [Math.random() * 10 - 5, Math.random() * 10 - 5];
        });
        return p;
    }, [riskData, whData]);

    const edgeX = [], edgeY = [];
    edgeData.forEach(e => {
        const s = pos[e.SOURCENODEID], t = pos[e.TARGETNODEID];
        if (s && t) { edgeX.push(s[0], t[0], null); edgeY.push(s[1], t[1], null); }
    });

    if (loading) return <div className="bg-[var(--bg-card)] p-8 rounded-lg flex items-center justify-center"><ChartLoader /></div>;
    if (!riskData || riskData.length === 0) return <EmptyState message="No seller data available." />;

    return (
        <div className="bg-[var(--bg-card)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-1 text-[var(--text-primary)]">Supply Chain Network — Seller → Warehouse</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
                Node size = PageRank | Color = Risk level | Diamond = Warehouse
                &nbsp;·&nbsp;<span className="text-blue-500">Scroll to zoom · Drag to pan</span>
            </p>
            <NetworkPlot
                pos={pos}
                sellerNodes={riskData.slice(0, 80)}
                whNodes={whData}
                edgeX={edgeX}
                edgeY={edgeY}
            />
        </div>
    );
}
