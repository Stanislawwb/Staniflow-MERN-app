import { useGetProjectsQuery } from "../api/projectApi";
import ProjectsList from "./ProjectsList";

const Projects: React.FC = () => {
	const { data: projects } = useGetProjectsQuery();

	return (
		<>
			<ProjectsList projects={projects} />
		</>
	);
};

export default Projects;
