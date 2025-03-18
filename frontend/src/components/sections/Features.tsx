import placeholderImage from "../../assets/placeholder-image.jpg";

const Features = () => {
	return (
		<section className="section-features">
			<div className="shell">
				<div className="section__inner">
					<div className="section__head">
						<h3>Powerful Features to Supercharge Your Workflow</h3>

						<p>
							StaniFlow helps you organize, collaborate, and track
							progress effortlessly. Stay in control with these
							powerful features:
						</p>
					</div>

					<div className="section__content">
						<ul>
							<li>Project & Task Management</li>

							<li>Assign Tasks to Team Members</li>

							<li>Private Projects with Controlled Access</li>

							<li>Drag & Drop Workflow</li>

							<li>Edit Tasks & Projects Anytime</li>

							<li>Track Your Progress Visually</li>
						</ul>

						<div className="section__image">
							<img
								src={placeholderImage}
								alt="placeholder-image"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Features;
