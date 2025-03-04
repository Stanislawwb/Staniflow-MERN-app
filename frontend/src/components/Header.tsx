import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "../assets/staniflow-logo.png";

const Header: React.FC = () => {
	return (
		<header className="header">
			<div className="shell shell--large">
				<div className="header__inner">
					<Link to="/" className="logo">
						<img src={logo} alt="" />
					</Link>

					<Navbar />
				</div>
			</div>
		</header>
	);
};

export default Header;
