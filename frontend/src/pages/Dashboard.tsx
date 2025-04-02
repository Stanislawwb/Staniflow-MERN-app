import { useDispatch } from "react-redux";
import Projects from "../components/Projects";
import { openModal } from "../store/modalSlice";
import { AppDispatch } from "../store/store";
import { useGetMeQuery } from "../api/userApi";
import { useEffect } from "react";
import { setUser } from "../store/authSlice";

const Dashboard = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { data: currentUser } = useGetMeQuery();

	useEffect(() => {
		if (currentUser) {
			dispatch(setUser(currentUser));
		}
	}, [currentUser, dispatch]);

	return (
		<div className="dashboard">
			<div className="shell shell--large">
				<div className="dashboard__inner">
					<div className="dashboard__header">
						<h1 className="h5">Project List</h1>

						<button
							className="btn btn--green"
							onClick={() =>
								dispatch(
									openModal({
										type: "project-create",
										payload: {
											currentUserId: currentUser?._id,
										},
									})
								)
							}
						>
							Create project
						</button>
					</div>

					<div className="dashboard__body">
						<Projects />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
