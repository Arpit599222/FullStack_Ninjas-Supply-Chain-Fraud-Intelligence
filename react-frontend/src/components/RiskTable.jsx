import React, { useState, useMemo, useRef } from 'react';
import { ExportButtons, EmptyState, Pagination, RiskBadge, FraudFlag } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import { risk_df } from '../utils/mockData';

export default function RiskTable() {
    const [platform, setPlatform] = useState('All');
    const [riskLevel, setRiskLevel] = useState('All');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [sortCol, setSortCol] = useState('RISK_SCORE');
    const [sortAsc, setSortAsc] = useState(false);
    const [showInvestigationModal, setShowInvestigationModal] = useState(false);

    const handleInvestigation = () => {
        setShowInvestigationModal(true);
    };

    const filtered = useMemo(() => {
        let data = (risk_df || []).filter(r => {
            if (platform !== 'All' && r.PLATFORM !== platform) return false;
            if (riskLevel !== 'All' && r.RISK_LEVEL !== riskLevel) return false;
            return true;
        });
        data = [...data].sort((a, b) => {
            const av = a[sortCol], bv = b[sortCol];
            if (typeof av === 'number') return sortAsc ? av - bv : bv - av;
            return sortAsc
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });
        return data;
    }, [platform, riskLevel, sortCol, sortAsc]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const handlePageSize = (s) => { setPageSize(s); setPage(1); };
    const handlePlatform = (v) => { setPlatform(v); setPage(1); };
    const handleRisk     = (v) => { setRiskLevel(v); setPage(1); };
    const toggleSort     = (col) => { setSortCol(col); setSortAsc(p => sortCol === col ? !p : false); };

    const exportData = filtered.map(r => ({
        Seller_Name: r.SELLER_NAME,
        Platform: r.PLATFORM,
        City: r.CITY,
        Risk_Level: r.RISK_LEVEL,
        Risk_Score: parseFloat(r.RISK_SCORE.toFixed(2)),
        PageRank_Score: parseFloat(r.PAGERANK_SCORE.toFixed(4)),
        Community: r.LOUVAIN_COMMUNITY,
        WCC_Entity: r.WCC_ENTITY,
        Return_Rate: parseFloat(r.RETURN_RATE.toFixed(4)),
        Fraud_Flag: r.FRAUD_FLAG,
    }));

    const COLS = [
        { key: 'SELLER_NAME', label: 'Seller Name' },
        { key: 'PLATFORM',    label: 'Platform' },
        { key: 'CITY',        label: 'City' },
        { key: 'RISK_LEVEL',  label: 'Risk Level', noSort: true },
        { key: 'RISK_SCORE',  label: 'Risk Score' },
        { key: 'PAGERANK_SCORE', label: 'PageRank' },
        { key: 'LOUVAIN_COMMUNITY', label: 'Community' },
        { key: 'WCC_ENTITY',  label: 'WCC Entity' },
        { key: 'RETURN_RATE', label: 'Return Rate' },
        { key: 'FRAUD_FLAG',  label: 'Fraud Status', noSort: true },
    ];

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[var(--border-subtle)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <select value={platform} onChange={e => handlePlatform(e.target.value)} className="premium-select w-full sm:w-48">
                            <option value="All">All Platforms</option>
                            <option value="Amazon">Amazon</option>
                            <option value="Flipkart">Flipkart</option>
                        </select>
                        <select value={riskLevel} onChange={e => handleRisk(e.target.value)} className="premium-select w-full sm:w-48">
                            <option value="All">All Risks</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <ExportButtons
                            onCSV={() => downloadCSV(exportData, 'seller-risk-table')}
                            onExcel={() => downloadExcel(exportData, 'seller-risk-table')}
                            onPDF={() => downloadPDF(exportData, 'seller-risk-table')}
                            disabled={filtered.length === 0}
                        />
                    </div>
                </div>
            </div>

            <div className="premium-table-container max-h-[400px] md:max-h-[500px] border-none rounded-none w-full overflow-x-auto">
                {filtered.length === 0 ? (
                    <EmptyState message="No sellers match the selected filters." />
                ) : (
                    <table className="premium-table min-w-[800px] w-full text-xs md:text-sm">
                        <thead>
                            <tr>
                                {COLS.map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => !col.noSort && toggleSort(col.key)}
                                        style={{ cursor: col.noSort ? 'default' : 'pointer' }}
                                    >
                                        {col.label}
                                        {!col.noSort && sortCol === col.key && (
                                            <span style={{ marginLeft: 6, color: 'var(--text-primary)' }}>
                                                {sortAsc ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((r, i) => (
                                <React.Fragment key={r.SELLER_NAME || i}>
                                    <tr 
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td style={{ fontWeight: 500 }}>
                                            <div className="flex flex-col gap-1 items-start">
                                                <span>{r.SELLER_NAME}</span>
                                                {r.ADMIN_REASON && (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded shadow-sm border border-blue-500/20">
                                                        MODIFIED BY ADMIN
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{r.PLATFORM}</td>
                                        <td>{r.CITY}</td>
                                        <td><RiskBadge level={r.RISK_LEVEL} /></td>
                                        <td>{r.RISK_SCORE.toFixed(2)}</td>
                                        <td>{r.PAGERANK_SCORE.toFixed(4)}</td>
                                        <td>{r.LOUVAIN_COMMUNITY}</td>
                                        <td>{r.WCC_ENTITY}</td>
                                        <td>{r.RETURN_RATE.toFixed(4)}</td>
                                        <td>
                                            <FraudFlag isFraud={r.FRAUD_FLAG === 1} onInvestigate={handleInvestigation} />
                                        </td>
                                    </tr>
                                    {r.ADMIN_REASON && (
                                        <tr style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                                            <td colSpan={10} style={{ padding: '8px 16px', borderTop: 'none', borderBottom: '1px solid var(--border-subtle)' }}>
                                                <div className="text-xs text-blue-300 flex items-start gap-2">
                                                    <span className="opacity-80 mt-0.5 font-semibold">Override Reason:</span>
                                                    <span className="italic">{r.ADMIN_REASON}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {filtered.length > 0 && (
                <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onPrev={() => setPage(p => Math.max(1, p - 1))}
                    onNext={() => setPage(p => Math.min(totalPages, p + 1))}
                    pageSize={pageSize}
                    setPageSize={handlePageSize}
                    totalRows={filtered.length}
                />
            )}

            {showInvestigationModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowInvestigationModal(false)}>
                    <div 
                        className="relative w-full max-w-md bg-[var(--bg-deep)] rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-[var(--border-subtle)] p-6 md:p-8 animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            🚀 Investigation Module Coming Soon
                        </h3>
                        
                        <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-4">
                            We are actively working on an advanced investigation system that will provide detailed fraud analysis, root cause insights, and intelligent recommendations.
                        </p>
                        
                        <p className="text-blue-400 text-xs md:text-sm font-medium mb-8">
                            Stay tuned — this feature will enhance decision-making and fraud control.
                        </p>
                        
                        <button 
                            onClick={() => setShowInvestigationModal(false)}
                            className="w-full py-3 btn-primary text-[1.1em] mt-4"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
