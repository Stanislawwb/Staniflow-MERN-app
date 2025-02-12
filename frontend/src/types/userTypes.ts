export interface User {
	_id: string;
	username: string;
	email: string;
	avatar: string;
	projects: string[];
	role: "admin" | "member";
}

export interface UserRegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface UserLoginRequest {
	email: string;
	password: string;
}

export interface UserResponse {
	user: {
		_id: string;
		username: string;
		email: string;
	};
	accessToken: string;
}

export interface UsersResponse {
	_id: string;
	username: string;
	email: string;
}
