import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLogoutUserMutation } from "../api/userApi";
import { logout } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";
const Navbar = () => {
	const { token } = useSelector((state: RootState) => state.auth);

	const [logoutUser] = useLogoutUserMutation();

	const dispatch = useDispatch<AppDispatch>();
	const nagivate = useNavigate();

	const handleLogout = async () => {
		await logoutUser();

		dispatch(logout());
		dispatch(api.util.resetApiState());
		nagivate("/");
	};
	return (
		<nav className="navbar">
			{token && (
				<Link className="btn btn--nav" to="/dashboard">
					Dashboard
				</Link>
			)}

			<div className="navbar__auth">
				{!token ? (
					<>
						<Link className="btn" to="/login">
							Log In
						</Link>

						<Link className="btn btn--solid" to="/register">
							Sign Up
						</Link>
					</>
				) : (
					<button className="btn btn--solid" onClick={handleLogout}>
						Logout
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
