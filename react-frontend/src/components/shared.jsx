import React from 'react';

export function ExportButtons({ onCSV, onExcel, onPDF, disabled = false }) {
    // Replace inline styles for buttons with standard classes
    const btnClass = "btn-secondary hover-lift";

    const buttons = [
        { label: 'CSV', onClick: onCSV },
        { label: 'Excel', onClick: onExcel },
        { label: 'PDF', onClick: onPDF },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Export:
            </span>
            {buttons.map(({ label, onClick }) => (
                <button
                    key={label}
                    onClick={onClick}
                    disabled={disabled}
                    className={btnClass}
                    style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        opacity: disabled ? 0.5 : 1,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export function ChartLoader() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', minHeight: 200,
        }}>
            <div style={{
                width: 24, height: 24,
                borderRadius: '50%',
                border: '2px solid var(--border-subtle)',
                borderTopColor: 'var(--text-secondary)',
                animation: 'spinRing 1s linear infinite',
            }} />
        </div>
    );
}

export function EmptyState({ message = 'No data available.' }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 120, fontSize: '0.85rem', color: 'var(--text-muted)'
        }}>
            {message}
        </div>
    );
}

export function Pagination({ page, totalPages, onPrev, onNext, pageSize, setPageSize, totalRows }) {
    const baseBtn = (disabled) => "btn-secondary " + (disabled ? "opacity-50 cursor-not-allowed" : "hover-lift");

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="premium-select"
                >
                    {[25, 50, 100].map(s => <option key={s} value={s}>{s} rows</option>)}
                </select>
                <span>Total {totalRows}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={onPrev} 
                  disabled={page === 1} 
                  className={`px-3 py-1.5 text-xs ${baseBtn(!page || page === 1 ? true : false)}`}
                >
                    Prev
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {page} / {totalPages}
                </span>
                <button 
                  onClick={onNext} 
                  disabled={page === totalPages} 
                  className={`px-3 py-1.5 text-xs ${baseBtn(page === totalPages)}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Global badging and flagging components
export function RiskBadge({ level }) {
    const styles = {
        HIGH:   { bg: '#ef4444', text: '#ffffff', shadow: 'rgba(239, 68, 68, 0.4)' },
        MEDIUM: { bg: '#f59e0b', text: '#ffffff', shadow: 'rgba(245, 158, 11, 0.3)' },
        LOW:    { bg: '#10b981', text: '#ffffff', shadow: 'rgba(16, 185, 129, 0.3)' },
    };
    const s = styles[level] || styles.LOW;
    return (
        <span title={`Risk Level: ${level}`} style={{ 
            backgroundColor: s.bg, 
            color: s.text,
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '0.04em',
            boxShadow: `0 0 10px ${s.shadow}`,
            textTransform: 'capitalize'
        }}>
            {level.toLowerCase()}
        </span>
    );
}

export function FraudFlag({ isFraud, onInvestigate }) {
  if (!isFraud) return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Clear</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
       <span title="This entity shows suspicious behavior based on network connections and transaction anomalies." 
             style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'help', display: 'flex', alignItems: 'center', gap: 4 }}>
         🚨 Fraud Flagged
       </span>
       <button 
          className="btn-primary"
          style={{ padding: '4px 10px', fontSize: '0.65rem', fontWeight: 600 }}
          onClick={(e) => {
              e.stopPropagation();
              if (onInvestigate) onInvestigate();
          }}>
         Investigate
       </button>
    </div>
  )
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes spinRing {
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleTag);
