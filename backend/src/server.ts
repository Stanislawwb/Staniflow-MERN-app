import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

const startServer = async () => {
	try {
		await mongoose.connect(env.MONGO_CONNECTION_STRING);
		console.log("Mongoose connected");

		app.listen(port, () => {
			console.log(`Server is working on port: ${port}`);
		});
	} catch (error) {
		console.log("Failed to start the server:", error);
		process.exit(1);
	}
};

startServer();
