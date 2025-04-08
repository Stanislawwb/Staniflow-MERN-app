import { DetailedProject } from "../../types/projectTypes";

type ProjectHeaderProps = {
	project?: DetailedProject;
	onEdit: () => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onEdit }) => {
	return (
		<div className="project__header">
			<div className="shell">
				<div className="project__header-inner">
					<div className="project__header-content">
						<h1 className="h5">{project?.title}</h1>
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
