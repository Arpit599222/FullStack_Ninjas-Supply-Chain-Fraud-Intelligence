import React, { useState, useMemo } from 'react';
import { ExportButtons, EmptyState, Pagination } from './shared';
import { downloadCSV, downloadExcel, downloadPDF } from '../utils/tableExport';
import AiExplainerModal from './AiExplainerModal';
import { risk_df } from '../utils/mockData';

const PAGE_SIZES = [25, 50, 100];

function RiskBadge({ level }) {
    const cls = level === 'HIGH' ? 'bg-red-900 text-red-300'
        : level === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300'
        : 'bg-green-900 text-green-300';
    return <span className={`px-2 py-1 rounded text-xs font-bold ${cls}`}>{level}</span>;
}

export default function RiskTable() {
    const [platform, setPlatform] = useState('All');
    const [riskLevel, setRiskLevel] = useState('All');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedSeller, setSelectedSeller] = useState(null);  // AI modal target

    const filtered = useMemo(() => {
        return (risk_df || []).filter(r => {
            if (platform !== 'All' && r.PLATFORM !== platform) return false;
            if (riskLevel !== 'All' && r.RISK_LEVEL !== riskLevel) return false;
            return true;
        });
    }, [platform, riskLevel]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const handlePageSize = (s) => { setPageSize(s); setPage(1); };
    const handlePlatform = (v) => { setPlatform(v); setPage(1); };
    const handleRisk = (v) => { setRiskLevel(v); setPage(1); };

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

    return (
        <div>
            {/* AI Explainer Modal */}
            {selectedSeller && (
                <AiExplainerModal
                    seller={selectedSeller}
                    onClose={() => setSelectedSeller(null)}
                />
            )}

            <h2 className="text-xl font-bold mb-4">Complete Seller Risk Table</h2>

            {/* Filters + Export */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex flex-col w-52">
                        <label className="text-xs text-gray-400 mb-1">Platform</label>
                        <select value={platform} onChange={e => handlePlatform(e.target.value)}
                            className="bg-[#1a1a2e] border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2">
                            <option value="All">All</option>
                            <option value="Amazon">Amazon</option>
                            <option value="Flipkart">Flipkart</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-52">
                        <label className="text-xs text-gray-400 mb-1">Risk Level</label>
                        <select value={riskLevel} onChange={e => handleRisk(e.target.value)}
                            className="bg-[#1a1a2e] border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2">
                            <option value="All">All</option>
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>
                </div>
                <ExportButtons
                    onCSV={() => downloadCSV(exportData, 'seller-risk-table')}
                    onExcel={() => downloadExcel(exportData, 'seller-risk-table', 'Risk Table')}
                    onPDF={() => downloadPDF(exportData, 'seller-risk-table', 'Seller Risk Table')}
                    disabled={filtered.length === 0}
                />
            </div>

            <p className="mb-3 text-gray-300 text-sm">
                Showing <span className="font-bold text-white">{filtered.length}</span> sellers
                {filtered.length !== risk_df.length && <span className="text-gray-500"> (filtered from {risk_df.length})</span>}
            </p>

            <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-auto max-h-[460px]">
                    {filtered.length === 0 ? (
                        <EmptyState message="No sellers match the selected filters." />
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#242440] text-gray-300 sticky top-0 shadow z-10">
                                <tr>
                                    <th className="p-3 whitespace-nowrap">Seller Name</th>
                                    <th className="p-3">Platform</th>
                                    <th className="p-3">City</th>
                                    <th className="p-3">Risk Level</th>
                                    <th className="p-3">Risk Score</th>
                                    <th className="p-3">PageRank</th>
                                    <th className="p-3">Community</th>
                                    <th className="p-3">WCC Entity</th>
                                    <th className="p-3">Return Rate</th>
                                    <th className="p-3">Fraud Flag</th>
                                    <th className="p-3">AI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows.map((r, i) => (
                                    <tr key={i} className="border-b border-gray-800 hover:bg-[#202035] transition-colors">
                                        <td className="p-3 font-medium whitespace-nowrap">{r.SELLER_NAME}</td>
                                        <td className="p-3">{r.PLATFORM}</td>
                                        <td className="p-3">{r.CITY}</td>
                                        <td className="p-3"><RiskBadge level={r.RISK_LEVEL} /></td>
                                        <td className="p-3">{r.RISK_SCORE.toFixed(2)}</td>
                                        <td className="p-3">{r.PAGERANK_SCORE.toFixed(4)}</td>
                                        <td className="p-3">{r.LOUVAIN_COMMUNITY}</td>
                                        <td className="p-3">{r.WCC_ENTITY}</td>
                                        <td className="p-3">{r.RETURN_RATE.toFixed(4)}</td>
                                        <td className="p-3">{r.FRAUD_FLAG === 1 ? '🔴 Yes' : '🟢 No'}</td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => setSelectedSeller(r)}
                                                className="px-2 py-1 text-xs bg-blue-900/60 hover:bg-blue-700 border border-blue-700/50 text-blue-300 rounded-lg transition-colors whitespace-nowrap"
                                                title="Explain risk using Gemini AI"
                                            >🤖 Explain</button>
                                        </td>
                                    </tr>
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
            </div>
        </div>
    );
}
