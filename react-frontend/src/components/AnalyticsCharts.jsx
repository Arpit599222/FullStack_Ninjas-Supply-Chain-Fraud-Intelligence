import React from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df } from '../utils/mockData';

const cmap = { HIGH: '#FF4444', MEDIUM: '#FFA500', LOW: '#44BB44' };

function PlotCard({ title, data, layout, filename, height = 320 }) {
    const { ref, loading } = usePlotly(
        data,
        { barmode: 'stack', paper_bgcolor: 'white', plot_bgcolor: 'white', margin: { t: 15, l: 40, r: 15, b: 55 }, height, legend: { orientation: 'h', y: -0.3 }, ...layout },
        { filename, scrollZoom: false }
    );
    return (
        <div className="bg-white rounded-lg p-3 border border-gray-200">
            <h3 className="text-gray-800 font-bold mb-1 text-sm">{title}</h3>
            <div className="relative" style={{ height: `${height}px` }}>
                {loading && <div className="absolute inset-0 flex items-center justify-center bg-white z-10"><ChartLoader /></div>}
                <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}

export default function AnalyticsCharts() {
    if (!risk_df || risk_df.length === 0) return <EmptyState message="No analytics data available." />;

    const getGroupedData = (key) => {
        const groups = {};
        risk_df.forEach(r => {
            if (!groups[r[key]]) groups[r[key]] = { HIGH: 0, MEDIUM: 0, LOW: 0 };
            groups[r[key]][r.RISK_LEVEL]++;
        });
        return Object.keys(groups).map(k => ({ label: k, ...groups[k] }));
    };

    const platformData = getGroupedData('PLATFORM');
    const cityData = getGroupedData('CITY');
    const barTrace = (data, level) => ({
        x: data.map(d => d.label), y: data.map(d => d[level]),
        name: level, type: 'bar', marker: { color: cmap[level] },
    });

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Fraud Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <PlotCard title="Risk Distribution by Platform" filename="risk-by-platform"
                    data={['HIGH', 'MEDIUM', 'LOW'].map(l => barTrace(platformData, l))} />
                <PlotCard title="Risk by City" filename="risk-by-city"
                    data={['HIGH', 'MEDIUM', 'LOW'].map(l => barTrace(cityData, l))} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlotCard
                    title="Overall Risk Distribution"
                    filename="risk-distribution"
                    data={[{
                        values: ['HIGH', 'MEDIUM', 'LOW'].map(l => risk_df.filter(d => d.RISK_LEVEL === l).length),
                        labels: ['HIGH', 'MEDIUM', 'LOW'],
                        type: 'pie',
                        marker: { colors: [cmap.HIGH, cmap.MEDIUM, cmap.LOW] },
                    }]}
                    layout={{ barmode: undefined }}
                />
                <PlotCard
                    title="Top Communities by Avg Risk Score"
                    filename="communities-risk"
                    data={[{
                        x: Array.from({ length: 10 }, (_, i) => `Comm ${i + 1}`),
                        y: Array.from({ length: 10 }, () => Math.round(Math.random() * 80 + 10)),
                        type: 'bar', marker: { color: '#fb8072' },
                    }]}
                />
            </div>
        </div>
    );
}
