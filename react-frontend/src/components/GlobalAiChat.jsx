import React, { useState, useRef, useEffect } from 'react';

// Markdown-lite renderer (same as in AiExplainerModal)
function AiText({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className="space-y-1 text-sm leading-relaxed">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />;
                const parts = line.split(/\*\*(.*?)\*\*/g);
                const content = parts.map((p, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
                );
                if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                    return <div key={i} className="flex gap-2"><span className="text-blue-400 mt-0.5 flex-shrink-0">•</span><span>{content}</span></div>;
                }
                if (/^\d+\./.test(line.trim())) {
                    return <p key={i} className="font-medium text-blue-300">{content}</p>;
                }
                return <p key={i}>{content}</p>;
            })}
        </div>
    );
}

const SUGGESTED = [
    'Summarize the current fraud landscape',
    'What is PageRank used for in fraud detection?',
    'How do fraud rings exploit supply chains?',
    'What does WCC entity resolution mean?',
];

/**
 * GlobalAiChat — floating chat button that opens a general-purpose
 * Gemini fraud analysis chatbot (no seller context required).
 */
export default function GlobalAiChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'model',
        text: 'Hello! I\'m your AI fraud analyst. Ask me anything about supply chain fraud, risk scores, or the data in this dashboard.',
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const historyRef = useRef([]);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    async function send(e) {
        e.preventDefault();
        const msg = input.trim();
        if (!msg || loading) return;
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInput('');
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/api/chatbot/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    data: {
                        seller_id: "Unknown",
                        warehouse_id: "Unknown",
                        risk_score: "Unknown",
                        transaction_pattern: "Unknown"
                    }
                })
            });
            if (!response.ok) throw new Error('Backend communication failed');
            const data = await response.json();
            const reply = data.reply;

            historyRef.current = [
                ...historyRef.current,
                { role: 'user', parts: [{ text: msg }] },
                { role: 'model', parts: [{ text: reply }] },
            ];
            setMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, {
                role: 'model',
                text: 'Sorry, I am unable to connect to the server. Please check your connection or try again later.',
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110"
                title="Open AI Fraud Analyst"
            >
                {open ? '✕' : '🤖'}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] bg-[#0f1117] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style={{ maxHeight: '70vh' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <span>🤖</span>
                            <div>
                                <p className="text-sm font-bold text-white leading-none">AI Fraud Analyst</p>
                                <p className="text-xs text-gray-500 mt-0.5">Powered by Google AI Studio (Gemini)</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-2xl px-3 py-2.5 max-w-[85%] text-sm ${
                                    m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : m.isError
                                            ? 'bg-red-900/40 border border-red-700/40 text-red-300 rounded-bl-sm'
                                            : 'bg-[#1a1a2e] border border-gray-800 text-gray-300 rounded-bl-sm'
                                }`}>
                                    {m.role === 'model' && !m.isError ? <AiText text={m.text} /> : m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        {[0, 150, 300].map(d => (
                                            <div key={d} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {messages.length === 1 && (
                            <div className="flex flex-col gap-1.5 mt-2">
                                {SUGGESTED.map(q => (
                                    <button key={q} onClick={() => setInput(q)}
                                        className="text-left text-xs px-3 py-2 bg-[#1a1a2e] border border-gray-700 rounded-xl text-gray-400 hover:border-blue-600 hover:text-blue-300 transition-colors">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={send} className="flex gap-2 p-3 border-t border-gray-800">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about supply chain fraud…"
                            disabled={loading}
                            className="flex-1 bg-[#1a1a2e] border border-gray-700 text-white text-sm rounded-xl px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
                        />
                        <button type="submit" disabled={!input.trim() || loading}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-xl transition-colors flex-shrink-0">
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
