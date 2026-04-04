import React, { useState } from 'react';
import KPIGrid from './components/KPIGrid';
import Tabs from './components/Tabs';
import NetworkGraph from './components/NetworkGraph';
import FraudRings from './components/FraudRings';
import AnalyticsCharts from './components/AnalyticsCharts';
import PageRankGraph from './components/PageRankGraph';
import RiskTable from './components/RiskTable';
import Footer from './components/Footer';


function App() {
  const [activeTab, setActiveTab] = useState('Network Graph');

  const tabs = [
    { name: 'Network Graph', icon: '🕸' },
    { name: 'Fraud Rings', icon: '🔴' },
    { name: 'Analytics', icon: '📊' },
    { name: 'PageRank', icon: '📈' },
    { name: 'Risk Table', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-10 pt-4 flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_main.jpg" 
              alt="Shield Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Supply Chain Fraud Intelligence
            </h1>
          </div>
          <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
        </div>

        {/* Top KPIs */}
        <KPIGrid />

        <div className="w-full h-[1px] bg-gray-800 my-6"></div>

        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'Network Graph' && <NetworkGraph />}
          {activeTab === 'Fraud Rings' && <FraudRings />}
          {activeTab === 'Analytics' && <AnalyticsCharts />}
          {activeTab === 'PageRank' && <PageRankGraph />}
          {activeTab === 'Risk Table' && <RiskTable />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
