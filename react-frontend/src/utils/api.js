const API_BASE_URL = 'http://localhost:8000';

export const fetchRiskSummary = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/risk-summary/`);
        if (!response.ok) throw new Error('API connection failed');
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Error fetching risk summary:', error);
        return null; // Fallback handled in component
    }
};

export const fetchNetworkGraph = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/network-graph/`);
        if (!response.ok) throw new Error('API connection failed');
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Error fetching network graph:', error);
        return null;
    }
};

export const fetchWarehouses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/warehouses/`);
        if (!response.ok) throw new Error('API connection failed');
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return null;
    }
};

export const fetchAlerts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts/`);
        if (!response.ok) throw new Error('API connection failed');
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return null;
    }
};

export const sendChatbotMessage = async (message, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chatbot/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, data }),
        });
        if (!response.ok) throw new Error('Chatbot API failed');
        return await response.json();
    } catch (error) {
        console.error('Error sending chatbot message:', error);
        return { reply: "I'm having trouble connecting to the fraud intelligence engine right now.", is_fallback: true };
    }
};
