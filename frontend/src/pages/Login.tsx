import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/userApi";
import AuthLayout from "../components/layouts/AuthLayout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { login } from "../store/authSlice";

const Login = () => {
	const [loginUser] = useLoginUserMutation();
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const handleLogin = async (formData: {
		email: string;
		password: string;
	}) => {
		try {
			setError(null);
			const response = await loginUser(formData).unwrap();

			dispatch(login(response.accessToken));

			navigate("/dashboard");
		} catch (error: any) {
			setError(error?.data?.error || "Invalid email or password");
		}
	};

	return (
		<AuthLayout
			mode="login"
			onSubmit={handleLogin}
			error={error}
			setError={setError}
		/>
	);
};

export default Login;
