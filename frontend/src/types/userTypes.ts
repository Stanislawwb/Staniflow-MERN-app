export interface IUser {
	_id: string;
	username: string;
	email: string;
	avatar: string;
	projects: string[];
	role: "admin" | "member";
}

export interface IUserRegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface IUserLoginRequest {
	email: string;
	password: string;
}

export interface IUserResponse {
	user: {
		_id: string;
		username: string;
		email: string;
	};
	accessToken: string;
}

export interface IUsersResponse {
	_id: string;
	username: string;
	email: string;
}
