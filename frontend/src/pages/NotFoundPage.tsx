import { Link } from "react-router-dom";
import notFoundImage from "../assets/404.png";

const NotFoundPage = () => {
	return (
		<div className="not-found">
			<div className="shell">
				<div className="not-found__content">
					<img src={notFoundImage} alt="" />

					<Link to="/" className="btn">
						Go to Homepage
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
