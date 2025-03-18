import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
	faBriefcase,
	faClock,
	faHeadset,
	faShieldAlt,
	faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer__bar">
				<div className="shell">
					<ul>
						<li>
							<FontAwesomeIcon icon={faBriefcase} /> The
							everything app, for work.
						</li>

						<li>
							<FontAwesomeIcon icon={faHeadset} /> 24/7 support
						</li>

						<li>
							<FontAwesomeIcon icon={faSyncAlt} /> Weekly updates
						</li>

						<li>
							<FontAwesomeIcon icon={faShieldAlt} /> Secure and
							compliant
						</li>

						<li>
							<FontAwesomeIcon icon={faClock} /> 99.9% uptime
						</li>
					</ul>
				</div>
			</div>

			<div className="shell">
				<div className="footer__inner">
					<ul className="footer__links">
						<li>
							<Link to="/">Homeapge</Link>
						</li>

						<li>
							<Link to="/login">Login</Link>
						</li>

						<li>
							<Link to="/register">Register</Link>
						</li>

						<li>
							<Link to="/terms">Terms of Use</Link>
						</li>

						<li>
							<Link to="/privacy">Privacy Policy</Link>
						</li>
					</ul>

					<div className="socials">
						<p>Where you can find me</p>

						<ul>
							<li>
								<a href="" target="_blank">
									<FontAwesomeIcon icon={faGithub} />
								</a>
							</li>

							<li>
								<a href="">
									<FontAwesomeIcon icon={faLinkedin} />
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="footer__copyright">
					<p>
						&copy; {new Date().getFullYear()} StaniFlow. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
