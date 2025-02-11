import { Server } from "ws";

let wssInstance: Server | null = null;

export const setWSServer = (wss: Server) => {
	wssInstance = wss;
};

export const sendWebSocketMessage = (type: string, data: object) => {
	if (wssInstance) {
		wssInstance.clients.forEach((client) => {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify({ type, ...data }));
			}
		});
	}
};
