import React from 'react';

/**
 * Reusable export button group for tables.
 * Props: onCSV, onExcel, onPDF, disabled
 */
export function ExportButtons({ onCSV, onExcel, onPDF, disabled = false }) {
    const btn = 'px-3 py-1.5 rounded text-xs font-semibold transition-colors duration-150 disabled:opacity-40';
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 mr-1">Export:</span>
            <button
                onClick={onCSV}
                disabled={disabled}
                className={`${btn} bg-emerald-700 hover:bg-emerald-600 text-white`}
                title="Download as CSV"
            >
                ⬇ CSV
            </button>
            <button
                onClick={onExcel}
                disabled={disabled}
                className={`${btn} bg-blue-700 hover:bg-blue-600 text-white`}
                title="Download as Excel"
            >
                ⬇ Excel
            </button>
            <button
                onClick={onPDF}
                disabled={disabled}
                className={`${btn} bg-red-700 hover:bg-red-600 text-white`}
                title="Download as PDF"
            >
                ⬇ PDF
            </button>
        </div>
    );
}

/**
 * Loading spinner displayed while a chart is rendering.
 */
export function ChartLoader() {
    return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading chart…</p>
            </div>
        </div>
    );
}

/**
 * Empty state display when no data is available.
 */
export function EmptyState({ message = 'No data available.' }) {
    return (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            <span>⚠ {message}</span>
        </div>
    );
}

/**
 * Pagination controls.
 * Props: page, totalPages, onPrev, onNext, pageSize, setPageSize, totalRows
 */
export function Pagination({ page, totalPages, onPrev, onNext, pageSize, setPageSize, totalRows }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-3 bg-[#1a1a2e] border-t border-gray-800 text-xs text-gray-400">
            <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="bg-[#242440] border border-gray-700 text-white rounded px-1 py-0.5"
                >
                    {[25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <span>{totalRows} rows total</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={page === 1}
                    className="px-2 py-1 rounded bg-[#242440] hover:bg-[#3a3a60] disabled:opacity-40 text-white"
                >
                    ‹ Prev
                </button>
                <span className="text-white font-medium">Page {page} / {totalPages}</span>
                <button
                    onClick={onNext}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded bg-[#242440] hover:bg-[#3a3a60] disabled:opacity-40 text-white"
                >
                    Next ›
                </button>
            </div>
        </div>
    );
}
