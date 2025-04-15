import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { useGetProjectQuery } from "../api/projectApi";
import ProjectHeader from "../components/project-single/ProjectHeader";
import ProjectTabs from "../components/project-single/ProjectTabs";
import TaskBoard from "../components/project-single/TaskBoard";
import { openModal } from "../store/modalSlice";
import { AppDispatch } from "../store/store";
import { useState } from "react";
import Overview from "../components/project-single/Overview";

const SingleProjectPage = () => {
	const { projectId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const [activeTab, setActiveTab] = useState(1);

	const {
		data: project,
		isError,
		isLoading,
	} = useGetProjectQuery(projectId!, {
		skip: !projectId,
	});

	if (!projectId || isError || (!isLoading && !project)) {
		return <Navigate to="/not-found" replace />;
	}

	if (isLoading || !project) {
		return null;
	}
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
					{activeTab === 0 && <Overview project={project} />}

					{activeTab === 1 && <TaskBoard project={project} />}
				</div>
			</div>
		</div>
	);
};

export default SingleProjectPage;
