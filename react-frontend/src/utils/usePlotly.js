// Enhanced usePlotly hook with full Plotly modebar support
// Provides: zoom, pan, drag, reset view, download as PNG, lasso, box select

import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

export function usePlotly(data, layout, config = {}) {
    const ref = useRef(null);
    const [loading, setLoading] = useState(true);

    const defaultConfig = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio'],
        modeBarButtonsToAdd: [],
        displaylogo: false,
        toImageButtonOptions: {
            format: 'png',
            filename: config.filename || 'chart',
            scale: 2,
        },
        scrollZoom: true,
        ...config,
    };

    useEffect(() => {
        if (!ref.current || !data) return;
        setLoading(true);

        const defaultLayout = {
            dragmode: 'pan',
            ...layout,
        };

        Plotly.newPlot(ref.current, data, defaultLayout, defaultConfig)
            .then(() => setLoading(false));

        return () => {
            if (ref.current) Plotly.purge(ref.current);
        };
    }, []);

    return { ref, loading };
}

// Helper: download chart as PNG from a div ref
export function downloadChartAsPNG(ref, filename = 'chart') {
    if (!ref.current) return;
    Plotly.downloadImage(ref.current, {
        format: 'png',
        filename,
        width: 1200,
        height: 700,
        scale: 2,
    });
}

// Helper: reset chart view
export function resetChartView(ref) {
    if (!ref.current) return;
    Plotly.relayout(ref.current, { 'xaxis.autorange': true, 'yaxis.autorange': true });
}

export default Plotly;
