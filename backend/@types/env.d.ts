declare namespace NodeJS {
	export interface ProcessEnv {
		JWT_SECRET: string;
		JWT_REFRESH_SECRET: string;
		MONGO_CONNECTION_STRING: string;
		PORT: string;
	}
}
