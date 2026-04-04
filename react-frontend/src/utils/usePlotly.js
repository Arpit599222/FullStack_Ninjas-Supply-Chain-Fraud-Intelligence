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
            autosize: true,
            ...layout,
        };

        let resizeObserver;

        Plotly.newPlot(ref.current, data, defaultLayout, defaultConfig)
            .then(() => {
                setLoading(false);
                // Force a resize after small delays to guarantee it fits the container 
                // after CSS animations or tab switching have settled
                setTimeout(() => { if (ref.current) Plotly.Plots.resize(ref.current); }, 150);
                setTimeout(() => { if (ref.current) Plotly.Plots.resize(ref.current); }, 500);
            });

        // Add ResizeObserver to respond dynamically to container width/height changes
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                if (ref.current) {
                    window.requestAnimationFrame(() => {
                        Plotly.Plots.resize(ref.current);
                    });
                }
            });
            resizeObserver.observe(ref.current);
        }

        const handleResize = () => {
            if (ref.current) Plotly.Plots.resize(ref.current);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (resizeObserver && ref.current) {
                resizeObserver.unobserve(ref.current);
            }
            window.removeEventListener('resize', handleResize);
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
