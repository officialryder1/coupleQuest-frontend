// lib/websocket.js
export class CoupleWebSocket {
    constructor(userId, coupleId, handlers) {
        this.socket = null;
        this.userId = userId;
        this.coupleId = coupleId;
        this.handlers = handlers;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.connect();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        this.socket = new WebSocket(`${protocol}//${host}/ws/couple/`);

        this.socket.onopen = () => {
            this.reconnectAttempts = 0;
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.handleMessage(data);
        };

        this.socket.onclose = (e) => {
            console.log('WebSocket disconnected:', e.reason);
            this.reconnect();
        };

        this.socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            this.socket.close();
        };
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * this.reconnectAttempts, 5000);
            console.log(`Reconnecting in ${delay}ms...`);
            setTimeout(() => this.connect(), delay);
        }
    }

    handleMessage(data) {
        if (data.type && this.handlers[data.type]) {
            this.handlers[data.type](data.payload);
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}