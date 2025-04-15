import { DetailedProject } from "../../types/projectTypes";
import ProjectRow from "./ProjectRow";
import ProjectTableHeader from "./ProjectTableHeader";

interface ProjectListProps {
	projects: DetailedProject[] | undefined;
}

const ProjectsList: React.FC<ProjectListProps> = ({ projects }) => {
	return (
		<div
			role="table"
			aria-label="Project List"
			aria-rowcount={projects?.length || 0}
			className="projects"
		>
			<ProjectTableHeader />

			<div role="rowgroup" className="projects__body">
				{projects && projects.length > 0 ? (
					[...projects]
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime()
						)
						.map((project, index) => (
							<ProjectRow
								key={project._id}
								project={project}
								index={index}
							/>
						))
				) : (
					<div role="row">
						<span role="cell">No projects available</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectsList;
