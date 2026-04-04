import React from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div style={{
            display: 'flex',
            gap: 24,
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
        }}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        style={{
                            padding: '12px 0',
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 500 : 400,
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            background: 'transparent',
                            borderBottom: isActive ? '1px solid var(--text-primary)' : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease, border-color 0.2s ease',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
}
