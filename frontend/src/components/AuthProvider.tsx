import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { logout, setAccessToken } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
	children: ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);

	useEffect(() => {
		if (!token) return;

		const interval = setInterval(async () => {
			try {
				const refreshResponse = await fetch(
					`${API_URL}/users/refresh-token`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				const data = await refreshResponse.json();

				if (refreshResponse.ok && data.accessToken) {
					dispatch(setAccessToken(data.accessToken));
				} else {
					dispatch(logout());
					dispatch(api.util.resetApiState());
				}
			} catch (error) {
				console.error("Auto refresh failed", error);
				dispatch(logout());
			}
		}, 14 * 60 * 1000);

		return () => clearInterval(interval);
	}, [token, dispatch]);

	return <>{children}</>;
};

export default AuthProvider;
