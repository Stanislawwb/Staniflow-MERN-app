import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface AuthFormProps {
	mode: "login" | "register";
	onSubmit: (formData: FormData) => void;
	error: any;
	setError: (error: any) => void;
}

interface FormData {
	username?: string;
	email: string;
	password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
	mode,
	onSubmit,
	error,
	setError,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<FormData>();

	const email = watch("email");
	const password = watch("password");

	useEffect(() => {
		if (error) {
			setError(null);
		}
	}, [email, password, setError]);

	return (
		<form
			className="form-auth"
			onSubmit={handleSubmit((data) => onSubmit(data))}
		>
			<h1>{mode === "login" ? "Member Login" : "Register"}</h1>

			<div className="form__rows">
				<div className="form__error">
					{error && <p>Invalid email or password.</p>}
				</div>

				{mode === "register" && (
					<div className="form__row">
						<FontAwesomeIcon icon={faUser} />

						<input
							type="text"
							placeholder="Username"
							{...register("username", {
								required: "Username is required",
							})}
						/>
						{errors.username && (
							<p className="error">{errors.username.message}</p>
						)}
					</div>
				)}

				<div className="form__row">
					<FontAwesomeIcon icon={faEnvelope} />

					<input
						type="email"
						placeholder="Email"
						{...register("email", {
							required: "Email is required",
						})}
					/>
					{errors.email && (
						<p className="error">{errors.email.message}</p>
					)}
				</div>

				<div className="form__row">
					<FontAwesomeIcon icon={faLock} />

					<input
						type="password"
						placeholder="Password"
						{...register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message:
									"The password must be at least 6 characters long.",
							},
							pattern: {
								value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
								message:
									"Password must contain at least one uppercase letter and one special character.",
							},
						})}
					/>

					{errors.password && (
						<p className="error">{errors.password.message}</p>
					)}
				</div>
			</div>

			<button type="submit">
				{mode === "login" ? "Login" : "Register"}
			</button>

			<p>
				Forgot <Link to="/forgot-password">Username / Password?</Link>
			</p>

			<div className="form__footer">
				<Link to="/register">Create your Account</Link>
			</div>
		</form>
	);
};

export default AuthForm;
