import { useNavigate, useSearchParams } from "react-router-dom";
import { DetailedProject } from "../../types/projectTypes";
import ProjectRow from "./ProjectRow";
import ProjectTableHeader from "./ProjectTableHeader";

interface ProjectListProps {
	projects: DetailedProject[] | undefined;
}

const ProjectsList: React.FC<ProjectListProps> = ({ projects }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const currentSortBy = searchParams.get("sortBy") || "createdAt";
	const currentSortOrder = searchParams.get("sortOrder") || "desc";

	const handleSortChange = (field: string) => {
		const isSame = currentSortBy === field;
		const nextOrder = isSame && currentSortOrder === "asc" ? "desc" : "asc";

		searchParams.set("sortBy", field);
		searchParams.set("sortOrder", nextOrder);

		navigate({ search: searchParams.toString() });
	};

	return (
		<div
			role="table"
			aria-label="Project List"
			aria-rowcount={projects?.length || 0}
			className="projects"
		>
			<ProjectTableHeader
				currentSort={{
					sortBy: currentSortBy,
					sortOrder: currentSortOrder as "asc" | "desc",
				}}
				onSortChange={handleSortChange}
			/>

			<div role="rowgroup" className="projects__body">
				{projects && projects.length > 0 ? (
					projects.map((project, index) => (
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
