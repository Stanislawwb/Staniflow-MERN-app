import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { useGetProjectQuery } from "../api/projectApi";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectTabs from "../components/project/ProjectTabs";
import TaskBoard from "../components/project/TaskBoard";
import { openModal } from "../store/modalSlice";
import { AppDispatch } from "../store/store";
import { useState } from "react";
import Overview from "../components/project/Overview";

const SingleProjectPage = () => {
	const { projectId } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: project } = useGetProjectQuery(projectId);

	const handleEditProject = () => {
		if (!project) return;

		dispatch(
			openModal({
				type: "project-edit",
				payload: {
					projectId,
					defaultValues: {
						title: project?.title,
						description: project?.description,
						members: project?.members,
						dueDate: project?.dueDate,
					},
				},
			})
		);
	};

	const [activeTab, setActiveTab] = useState(1);

	const tabItems = [{ label: "Overview" }, { label: "Tasks" }];

	return (
		<div className="project-page">
			<div className="project__inner">
				<ProjectHeader project={project} onEdit={handleEditProject} />

				<ProjectTabs
					items={tabItems}
					activeIndex={activeTab}
					onTabClick={(index) => setActiveTab(index)}
				/>

				<div className="project__content">
					{activeTab === 0 && <Overview />}

					{activeTab === 1 && <TaskBoard />}
				</div>
			</div>
		</div>
	);
};

export default SingleProjectPage;
