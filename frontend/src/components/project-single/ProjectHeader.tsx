import { DetailedProject } from "../../types/projectTypes";
import ProgressBar from "../ProgressBar";

type ProjectHeaderProps = {
	project: DetailedProject;
	onEdit: () => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onEdit }) => {
	const progress =
		project.tasksCount > 0
			? (
					(project.completedTasksCount / project.tasksCount) *
					100
			  ).toFixed(2)
			: "0.00";

	return (
		<div className="project__header">
			<div className="shell">
				<div className="project__header-inner">
					<div className="project__header-content">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 98.18 122.88"
							className="project__icon"
							fill="currentColor"
						>
							<path
								className="cls-1"
								d="M27.23,65.62a1.75,1.75,0,0,1,2.5,0,1.8,1.8,0,0,1,0,2.53l-3,3.06,3,3.06a1.77,1.77,0,0,1-2.51,2.51l-3-3-3,3a1.75,1.75,0,0,1-2.5,0,1.81,1.81,0,0,1,0-2.53l3-3.06-3-3.06a1.78,1.78,0,0,1,0-2.51,1.74,1.74,0,0,1,2.48,0l3,3,3-3ZM25.85,22A3.93,3.93,0,0,1,22,18.12V16.81H5.71a.62.62,0,0,0-.59.6v99.71a.6.6,0,0,0,.59.59H92.47a.6.6,0,0,0,.59-.59V17.41a.62.62,0,0,0-.59-.59H76.53v1.31A3.93,3.93,0,0,1,72.65,22ZM5.75,122.88A5.76,5.76,0,0,1,0,117.13V17.41a5.76,5.76,0,0,1,5.75-5.75H22V10.44A3.91,3.91,0,0,1,25.9,6.55h6.92V4.3A4.36,4.36,0,0,1,37.11,0h24a4.37,4.37,0,0,1,4.3,4.3V6.56H72.6a3.91,3.91,0,0,1,3.89,3.89v1.22H92.43a5.76,5.76,0,0,1,5.75,5.75v99.71a5.76,5.76,0,0,1-5.75,5.75ZM78.19,99.05a2.6,2.6,0,0,0,0-5.2H43.57a2.6,2.6,0,1,0,0,5.2H78.19Zm0-50a2.6,2.6,0,1,0,0-5.2H43.57a2.6,2.6,0,0,0,0,5.2Zm0,24.64a2.6,2.6,0,1,0,0-5.2H43.57a2.6,2.6,0,1,0,0,5.2ZM18.83,96.31a2.31,2.31,0,0,1,3.84-2.57l1.26,1.87,5-6.07a2.3,2.3,0,1,1,3.56,2.92l-6.9,8.4a2.49,2.49,0,0,1-.55.52,2.31,2.31,0,0,1-3.2-.63l-3-4.44Zm.63-50.57a2.32,2.32,0,0,1,3.21.63l1.26,1.87,5-6.07a2.3,2.3,0,1,1,3.56,2.92l-6.9,8.4A2.49,2.49,0,0,1,25,54a2.31,2.31,0,0,1-3.2-.63l-3-4.44h0a2.31,2.31,0,0,1,.63-3.2Z"
							/>
						</svg>

						<div className="project__header-info">
							<h1 className="h5">{project?.title}</h1>

							<div className="project__header-progress">
								<ProgressBar project={project} />

								<span>{progress} % complete</span>
							</div>
						</div>
					</div>

					<div className="project__header-actions">
						<button className="btn btn--green" onClick={onEdit}>
							Edit Project
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectHeader;
