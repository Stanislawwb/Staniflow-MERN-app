import ParallaxTilt from "react-parallax-tilt";
import authImg from "../../assets/auth-img.png";
import AuthForm from "../AuthForm";

interface AuthLayoutProps {
	mode: "login" | "register";
	onSubmit: (formData: any) => void;
	error: any;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
	mode,
	onSubmit,
	error,
	setError,
}) => {
	return (
		<div className="auth-page">
			<div className="shell">
				<div className="auth__inner">
					<div className="auth__aside">
						<ParallaxTilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
							<img
								src={authImg}
								alt="IMG"
								className="tilt-image"
							/>
						</ParallaxTilt>
					</div>

					<div className="auth__content">
						<AuthForm
							mode={mode}
							onSubmit={onSubmit}
							error={error}
							setError={setError}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
