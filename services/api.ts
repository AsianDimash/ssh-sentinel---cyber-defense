const API_URL = '/api';

export const api = {
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return res.json();
    },

    getIncidents: async () => {
        const res = await fetch(`${API_URL}/incidents`);
        return res.json();
    },

    getLogs: async () => {
        const res = await fetch(`${API_URL}/logs`);
        return res.json();
    },

    addLog: async (log: any) => {
        const res = await fetch(`${API_URL}/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
        return res.json();
    },

    getBlocks: async () => {
        const res = await fetch(`${API_URL}/blocks`);
        return res.json();
    },

    addBlock: async (block: any) => {
        const res = await fetch(`${API_URL}/blocks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(block),
        });
        return res.json();
    },

    removeBlock: async (id: string) => {
        const res = await fetch(`${API_URL}/blocks/${id}`, {
            method: 'DELETE',
        });
        return res.json();
    },

    getStats: async () => {
        const res = await fetch(`${API_URL}/stats`);
        return res.json();
    }
};
