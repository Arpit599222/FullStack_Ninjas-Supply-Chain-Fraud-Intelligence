import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="loading-screen" aria-label="Loading Supply Chain Fraud Intelligence">
            <div className="loading-logo-wrapper fade-in" style={{ animationDelay: '0.1s' }}>
                <img
                    src="/logo_main.jpg"
                    alt="Shield Logo"
                    className="loading-logo-img"
                />
                <div className="loading-title">
                    Supply Chain Fraud Intelligence
                </div>
            </div>
            
            <div className="loading-bar-track fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="loading-bar-fill" />
            </div>
            <div className="fade-in" style={{ animationDelay: '0.5s', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Initializing Dashboard components...
            </div>
        </div>
    );
}
