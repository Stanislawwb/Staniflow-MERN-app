import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	useCreateProjectMutation,
	useGetProjectsQuery,
} from "../api/projectApi";
import { useGetMeQuery } from "../api/userApi";
import { RootState } from "../store/store";
import { CreateProjectRequest } from "../types/projectTypes";
import ProjectForm from "./ProjectForm";

const Projects = () => {
	const [displayModal, setDisplayModal] = useState(false);
	const [createProject] = useCreateProjectMutation();
	const { data: projects, refetch } = useGetProjectsQuery();
	const { data: currentUser } = useGetMeQuery();

	console.log(projects);

	const token = useSelector((state: RootState) => state.auth.token);

	const displayProjectModal = () => {
		setDisplayModal(!displayModal);
	};

	useEffect(() => {
		if (token) {
			refetch();
		}
	}, [token, refetch]);

	const handleCreateProject = async (formData: CreateProjectRequest) => {
		try {
			await createProject(formData).unwrap();

			setDisplayModal(false);
		} catch (error) {
			console.error("Error creating project:", error);
		}
	};

	return (
		<div className="section-projects">
			<div className="shell">
				<div className="section__inner">
					<h1>Projects</h1>

					<div className="projects">
						<div className="section__header">
							<p>This is a listing of your projects:</p>

							<button
								className="btn"
								onClick={displayProjectModal}
							>
								Create project
							</button>
						</div>

						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Progress</th>
									<th>Members</th>
									<th>Start</th>
									<th>End</th>
									<th>Status</th>
									<th>Owner</th>
								</tr>
							</thead>

							<tbody>
								{projects &&
									projects.map((project) => (
										<Link
											to={`projects/${project._id}`}
											className="project"
											key={project._id}
										>
											<tr>
												<td>{project.title}</td>

												{/* <td>{project.title}</td>  */}

												<td>
													{project.members &&
													project.members.length >
														0 ? (
														<div className="members-list">
															{project.members.map(
																(member) => (
																	<span
																		key={
																			member
																				.userId
																				._id
																		}
																	>
																		{member.userId.username
																			.charAt(
																				0
																			)
																			.toUpperCase()}
																	</span>
																)
															)}
														</div>
													) : (
														"-"
													)}
												</td>

												<td>
													{new Date(
														project.createdAt
													).toLocaleString("en-GB", {
														day: "2-digit",
														month: "short",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</td>

												<td>
													{new Date(
														project.dueDate
													).toLocaleString("en-GB", {
														day: "2-digit",
														month: "short",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</td>

												<td>{project.status}</td>

												<td>
													{project.createdBy.username}
												</td>
											</tr>
										</Link>
									))}
							</tbody>
						</table>
					</div>

					<div
						className={`section__modal ${
							displayModal === true ? "active" : ""
						}`}
						onClick={() => setDisplayModal(false)}
					>
						<ProjectForm
							setDisplayModal={setDisplayModal}
							onSubmit={handleCreateProject}
							currentUserId={currentUser?._id}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Projects;
