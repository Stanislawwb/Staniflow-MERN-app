import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "ws";
import { setWSServer } from "./service/websocketService";

const port = env.PORT;

const server = http.createServer(app);
const wss = new Server({ server });

setWSServer(wss);

const startServer = async () => {
	try {
		await mongoose.connect(env.MONGO_CONNECTION_STRING);
		console.log("Mongoose connected");

		server.listen(port, () => {
			console.log(`🚀 Server is working on port: ${port}`);
		});

		wss.on("connection", (ws) => {
			console.log("New WebSocket client connected!");

			ws.on("close", () => {
				console.log("WebSocket client disconnected.");
			});
		});
	} catch (error) {
		console.log("Failed to start the server:", error);
		process.exit(1);
	}
};

startServer();
