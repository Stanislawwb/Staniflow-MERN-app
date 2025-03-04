import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="navbar__auth">
				<Link className="btn" to="/login">
					Log In
				</Link>

				<Link className="btn btn--solid" to="/register">
					Sign Up
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
