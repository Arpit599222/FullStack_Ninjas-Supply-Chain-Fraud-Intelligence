import React from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="flex space-x-1 border-b border-gray-800">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`
                            flex items-center px-6 py-3 font-medium text-sm transition-colors duration-150
                            ${isActive 
                                ? 'border-b-2 border-blue-500 text-blue-400 bg-[#1a1a2e]' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-[#151525]'
                            }
                        `}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
}
