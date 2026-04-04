import React from 'react';
import { usePlotly } from '../utils/usePlotly';
import { ChartLoader, EmptyState } from './shared';
import { risk_df } from '../utils/mockData';

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

export default function AnalyticsCharts() {
    if (!risk_df || risk_df.length === 0)
        return <EmptyState message="No analytics data available." />;

    const getGroupedData = (key) => {
        const groups = {};
        risk_df.forEach(r => {
            if (!groups[r[key]]) groups[r[key]] = { HIGH: 0, MEDIUM: 0, LOW: 0 };
            groups[r[key]][r.RISK_LEVEL]++;
        });
        return Object.keys(groups).map(k => ({ label: k, ...groups[k] }));
    };

    const platformData = getGroupedData('PLATFORM');
    const cityData     = getGroupedData('CITY');

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
                    values: ['HIGH', 'MEDIUM', 'LOW'].map(l => risk_df.filter(d => d.RISK_LEVEL === l).length),
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
        </div>
    );
}
