class WebSocketService {
	private socket: WebSocket | null = null;
	private listeners: { [eventType: string]: ((data: any) => void)[] } = {};
	private readonly WS_URL: string =
		import.meta.env.VITE_WS_URL || "ws://localhost:5000";
	private reconnectTimeout: number | undefined;
	private pingInterval: number | undefined;

	connect() {
		if (this.socket) return;

		this.socket = new WebSocket(this.WS_URL);

		this.socket.onopen = () => {
			console.log("WebSocket Connected to", this.WS_URL);
			this.startPing();
		};

		this.socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				if (this.listeners[message.type]) {
					this.listeners[message.type].forEach((callback) =>
						callback(message)
					);
				}
			} catch (error) {
				console.error("WebSocket message error:", error);
			}
		};

		this.socket.onclose = () => {
			console.log("WebSocket Disconnected. Reconnecting...");
			this.cleanup();
			this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
		};

		this.socket.onerror = (error) => {
			console.error("WebSocket error:", error);
			this.socket?.close();
		};
	}

	on(eventType: string, callback: (data: any) => void) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType].push(callback);
	}

	isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN;
	}

	private startPing() {
		this.pingInterval = setInterval(() => {
			if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
				console.warn("WebSocket is not open, stopping PING.");
				this.cleanup();
				return;
			}
			this.socket.send(JSON.stringify({ type: "PING" }));
		}, 30000);
	}

	private cleanup() {
		if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
		if (this.pingInterval) clearInterval(this.pingInterval);

		this.reconnectTimeout = undefined;
		this.pingInterval = undefined;

		this.socket = null;
		this.listeners = {};
	}
}

export default new WebSocketService();
