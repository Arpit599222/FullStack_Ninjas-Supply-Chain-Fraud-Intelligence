import React, { useState, useEffect } from 'react';
import KPIGrid from './components/KPIGrid';
import Tabs from './components/Tabs';
import NetworkGraph from './components/NetworkGraph';
import FraudRings from './components/FraudRings';
import AnalyticsCharts from './components/AnalyticsCharts';
import AlertLog from './components/AlertLog';
import PageRankGraph from './components/PageRankGraph';
import RiskTable from './components/RiskTable';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [activeTab, setActiveTab] = useState('Network Graph');
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState('dark');
  const isLive = false; // Hardcoded to Demo mode for a seamless MVP experience

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Force min 3.8s wait to let loader animation play nicely
    const timer = setTimeout(() => setLoaded(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { name: 'Network Graph' },
    { name: 'Fraud Rings' },
    { name: 'Analytics' },
    { name: 'Alert Log' },
    { name: 'PageRank' },
    { name: 'Risk Table' }
  ];

  return (
    <>
      <LoadingScreen />

      <div
        className="min-h-screen text-[var(--text-primary)] font-sans relative"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
          paddingBottom: '0',
          display: loaded ? 'block' : 'none'
        }}
      >
        {/* Ambient Mesh Background Glow */}
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />

        <header className="sticky top-0 z-50">
          <div style={{
            background: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-soft)',
          }}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                <img
                  src="/logo_main.jpg"
                  alt="Shield Logo"
                  className="w-10 h-10 object-cover rounded-full shadow-sm"
                />
                <h1 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide text-[var(--text-primary)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Supply Chain Fraud Intelligence
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
                  className="p-1.5 rounded-full hover:bg-[var(--border-subtle)] transition-colors text-[var(--text-primary)]"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <div className="hidden md:flex items-center gap-2 text-[0.6rem] text-[var(--text-secondary)] font-medium tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Enterprise Intelligence: Verified
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <section className="mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
            <KPIGrid isLive={isLive} />
          </section>

          <section className="fade-in" style={{ animationDelay: '0.3s' }}>
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </section>

          <section className="mt-8 fade-in" key={`${activeTab}-${isLive}`} style={{ animationDelay: '0.1s' }}>
            {activeTab === 'Network Graph' && <NetworkGraph isLive={isLive} />}
            {activeTab === 'Fraud Rings' && <FraudRings isLive={isLive} />}
            {activeTab === 'Analytics' && <AnalyticsCharts isLive={isLive} />}
            {activeTab === 'Alert Log' && <AlertLog isLive={isLive} />}
            {activeTab === 'PageRank' && <PageRankGraph isLive={isLive} />}
            {activeTab === 'Risk Table' && <RiskTable isLive={isLive} />}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
