import { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../api/userApi";

const Register = () => {
	const [registerUser] = useRegisterUserMutation();
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleRegister = async (formData: {
		username: string;
		email: string;
		password: string;
	}) => {
		try {
			setError(null);
			await registerUser(formData).unwrap();

			navigate("/dashboard");
		} catch (error: any) {
			setError(error?.data?.error || "Something went wrong.");
		}
	};

	return (
		<AuthLayout
			mode="register"
			onSubmit={handleRegister}
			error={error}
			setError={setError}
		/>
	);
};

export default Register;
