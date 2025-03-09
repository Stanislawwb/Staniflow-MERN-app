import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/userApi";
import AuthLayout from "../components/layouts/AuthLayout";
import { useState } from "react";
const Login = () => {
	const [loginUser] = useLoginUserMutation();
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (formData: {
		email: string;
		password: string;
	}) => {
		try {
			setError(null);
			await loginUser(formData).unwrap();

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
