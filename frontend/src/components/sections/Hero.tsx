import { Link } from "react-router-dom";

const Hero = () => {
	return (
		<section className="section-hero">
			<div className="shell">
				<div className="section__inner">
					<h1>Organize. Track. Succeed.</h1>

					<p>
						StaniFlow – the flexible task and project management
						tool for teams who want to work smarter, not harder.
					</p>

					<Link to="/register" className="btn btn--solid btn--large">
						Get Started for Free
					</Link>

					<span>Free Forever. No Credit Card.</span>
				</div>
			</div>
		</section>
	);
};

export default Hero;
