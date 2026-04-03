// Export utilities for tables
// Supports: CSV, Excel (.xlsx), PDF (jsPDF + autoTable)

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Download data as CSV
 * @param {Array<Object>} data - Array of row objects
 * @param {string} filename - File name without extension
 */
export function downloadCSV(data, filename = 'export') {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    triggerDownload(new Blob([csv], { type: 'text/csv' }), `${filename}.csv`);
}

/**
 * Download data as Excel (.xlsx)
 * @param {Array<Object>} data
 * @param {string} filename
 * @param {string} sheetName
 */
export function downloadExcel(data, filename = 'export', sheetName = 'Sheet1') {
    if (!data || data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Download data as PDF using jsPDF + autoTable
 * @param {Array<Object>} data
 * @param {string} filename
 * @param {string} title
 */
export function downloadPDF(data, filename = 'export', title = 'Report') {
    if (!data || data.length === 0) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text(title, 40, 40);

    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => String(row[h] ?? '')));

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 60,
        styles: { fontSize: 7, cellPadding: 3 },
        headStyles: { fillColor: [26, 26, 46], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    doc.save(`${filename}.pdf`);
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
