import React, { useState, useRef, useEffect } from 'react';

// Markdown-lite renderer: bold **text**, bullets, line breaks
function AiText({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className="space-y-1 text-sm leading-relaxed">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />;
                // Bold
                const parts = line.split(/\*\*(.*?)\*\*/g);
                const content = parts.map((p, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
                );
                // Bullet
                if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                    return (
                        <div key={i} className="flex gap-2">
                            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                            <span>{content}</span>
                        </div>
                    );
                }
                // Numbered
                if (/^\d+\./.test(line.trim())) {
                    return <p key={i} className="font-medium text-blue-300">{content}</p>;
                }
                return <p key={i}>{content}</p>;
            })}
        </div>
    );
}

/**
 * AiExplainerModal — opens when the user clicks "Explain Risk using AI"
 * on a specific seller row.
 *
 * Props:
 *   seller  — the seller object (row from risk_df)
 *   onClose — function to close the modal
 */
export default function AiExplainerModal({ seller, onClose }) {
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatHistory = useRef([]);
    const chatEndRef = useRef(null);

    // Auto-fetch explanation when modal opens
    useEffect(() => {
        fetchExplanation();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    async function fetchExplanation() {
        setLoading(true);
        setError('');
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/api/chatbot/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Explain the risk for this seller.",
                    data: {
                        seller_id: seller.SELLER_NAME,
                        warehouse_id: 'Unknown',
                        risk_score: seller.RISK_SCORE?.toFixed(2),
                        transaction_pattern: `Platform: ${seller.PLATFORM}, Return Rate: ${(seller.RETURN_RATE * 100)?.toFixed(1)}%`
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Backend failed to respond properly.');
            }

            const resData = await response.json();
            setExplanation(resData.reply);
        } catch (err) {
            setError(`AI analysis failed: ${err.message || 'Unknown error. Please try again.'}`);
        } finally {
            setLoading(false);
        }
    }

    async function sendChat(e) {
        e.preventDefault();
        const msg = chatInput.trim();
        if (!msg || chatLoading) return;

        const userMsg = { role: 'user', text: msg };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    data: {
                        seller_id: seller.SELLER_NAME,
                        warehouse_id: 'Unknown',
                        risk_score: seller.RISK_SCORE?.toFixed(2),
                        transaction_pattern: `Platform: ${seller.PLATFORM}, Return Rate: ${(seller.RETURN_RATE * 100)?.toFixed(1)}%`
                    }
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const resData = await response.json();
            const reply = resData.reply;

            chatHistory.current = [
                ...chatHistory.current,
                { role: 'user', parts: [{ text: msg }] },
                { role: 'model', parts: [{ text: reply }] },
            ];
            setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, {
                role: 'model',
                text: `⚠ Error: Backend communication failed.`,
                isError: true,
            }]);
        } finally {
            setChatLoading(false);
        }
    }

    const riskColor = seller.RISK_LEVEL === 'HIGH' ? 'text-red-400' : seller.RISK_LEVEL === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#0f1117] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🤖</span>
                            <h2 className="text-lg font-bold text-white">AI Risk Explainer</h2>
                            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-medium">Powered by Google AI Studio (Gemini)</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            Analyzing: <span className="text-white font-medium">{seller.SELLER_NAME}</span>
                            &nbsp;·&nbsp;<span className={`font-semibold ${riskColor}`}>{seller.RISK_LEVEL} RISK</span>
                            &nbsp;·&nbsp;Score: <span className="text-white">{seller.RISK_SCORE?.toFixed(1)}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white text-xl leading-none ml-4 flex-shrink-0 transition-colors"
                        aria-label="Close"
                    >✕</button>
                </div>

                {/* AI Explanation */}
                <div className="p-5 border-b border-gray-800 overflow-y-auto max-h-64 bg-[#0d1117]">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Analysis</p>
                    {loading && (
                        <div className="flex items-center gap-3 text-blue-400">
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Analyzing fraud patterns…</span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300 text-sm">
                            <p className="font-semibold mb-1">⚠ Analysis Failed</p>
                            <p>{error}</p>
                            <button onClick={fetchExplanation} className="mt-2 text-xs text-blue-400 hover:underline">Try again</button>
                        </div>
                    )}
                    {!loading && !error && explanation && (
                        <div className="text-gray-300">
                            <AiText text={explanation} />
                        </div>
                    )}
                </div>

                {/* Chat Interface */}
                <div className="flex flex-col flex-1 min-h-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 pt-4 mb-2">Ask a follow-up question</p>

                    <div className="flex-1 overflow-y-auto px-5 space-y-3 min-h-[80px] max-h-48">
                        {chatMessages.length === 0 && (
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Why is this seller high risk?',
                                    'What action should we take?',
                                    'Is this part of a fraud ring?',
                                ].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => { setChatInput(q); }}
                                        className="text-xs px-3 py-1.5 bg-[#1a1a2e] border border-gray-700 rounded-full text-gray-300 hover:border-blue-500 hover:text-blue-300 transition-colors"
                                    >{q}</button>
                                ))}
                            </div>
                        )}
                        {chatMessages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${
                                    m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : m.isError
                                            ? 'bg-red-900/40 border border-red-700/40 text-red-300 rounded-bl-sm'
                                            : 'bg-[#1a1a2e] border border-gray-800 text-gray-300 rounded-bl-sm'
                                }`}>
                                    {m.role === 'model' && !m.isError
                                        ? <AiText text={m.text} />
                                        : m.text
                                    }
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={sendChat} className="flex gap-2 p-4 border-t border-gray-800 mt-2">
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            placeholder="Ask about this seller's risk…"
                            disabled={chatLoading}
                            className="flex-1 bg-[#1a1a2e] border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!chatInput.trim() || chatLoading}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
                        >Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
