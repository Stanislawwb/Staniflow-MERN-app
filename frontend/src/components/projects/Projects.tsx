import { useSearchParams } from "react-router-dom";
import { useGetProjectsQuery } from "../../api/projectApi";
import ProjectsList from "./ProjectsList";

const Projects: React.FC = () => {
	const [searchParams] = useSearchParams();

	const sortBy = searchParams.get("sortBy") || undefined;

	const rawSortOrder = searchParams.get("sortOrder");
	const sortOrder =
		rawSortOrder === "asc" || rawSortOrder === "desc"
			? rawSortOrder
			: undefined;

	const { data: projects } = useGetProjectsQuery({ sortBy, sortOrder });

	return (
		<>
			<ProjectsList projects={projects} />
		</>
	);
};

export default Projects;
