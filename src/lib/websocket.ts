export type WsStatus = 'Connecting' | 'Connected' | 'Disconnected';

type StatusListener = (status: WsStatus) => void;
type MessageListener = (data: any) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private status: WsStatus = 'Disconnected';
    private statusListeners: Set<StatusListener> = new Set();
    private messageListeners: Set<MessageListener> = new Set();
    private messageQueue: string[] = [];
    private requestId = 1;
    private reconnectInterval: number | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    public connect() {
        if (this.socket && this.socket.readyState < 2) return;
        
        const wsUrl = process.env.NEXT_PUBLIC_NITROLITE_WS_URL;
        if (!wsUrl) {
            console.error('NEXT_PUBLIC_NITROLITE_WS_URL is not set');
            this.updateStatus('Disconnected');
            return;
        }
        
        console.log('Connecting to Nitrolite WebSocket:', wsUrl);
        this.updateStatus('Connecting');
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket Connected to Nitrolite');
            this.updateStatus('Connected');
            this.reconnectAttempts = 0;
            
            // Clear any existing reconnect interval
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            
            // Send queued messages
            this.messageQueue.forEach((msg) => this.socket?.send(msg));
            this.messageQueue = [];
        };
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);
                this.messageListeners.forEach((listener) => listener(data));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        
        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            this.updateStatus('Disconnected');
            this.attemptReconnect();
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateStatus('Disconnected');
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        this.reconnectInterval = window.setTimeout(() => {
            this.connect();
        }, delay);
    }

    public disconnect() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
        
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        
        this.updateStatus('Disconnected');
    }

    public send(payload: string) {
        console.log('Sending WebSocket message:', payload);
        
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(payload);
        } else {
            console.log('WebSocket not ready, queuing message');
            this.messageQueue.push(payload);
        }
    }

    // Legacy method for backward compatibility
    public sendRPC(method: string, params: any) {
        const payload = JSON.stringify({ 
            jsonrpc: '2.0', 
            id: this.requestId++, 
            method, 
            params 
        });
        this.send(payload);
    }

    private updateStatus(newStatus: WsStatus) {
        this.status = newStatus;
        console.log('WebSocket status updated:', newStatus);
        this.statusListeners.forEach((listener) => listener(this.status));
    }

    public getStatus(): WsStatus {
        return this.status;
    }

    public addStatusListener(listener: StatusListener) {
        this.statusListeners.add(listener);
        // Immediately call with current status
        listener(this.status);
    }

    public removeStatusListener(listener: StatusListener) {
        this.statusListeners.delete(listener);
    }

    public addMessageListener(listener: MessageListener) {
        this.messageListeners.add(listener);
    }

    public removeMessageListener(listener: MessageListener) {
        this.messageListeners.delete(listener);
    }
    
    public clearListeners() {
        this.statusListeners.clear();
        this.messageListeners.clear();
    }
}

export const webSocketService = new WebSocketService();