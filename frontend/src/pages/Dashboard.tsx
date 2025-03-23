import { useDispatch } from "react-redux";
import Projects from "../components/Projects";
import { openProjectCreateModal } from "../store/projectCreateModalSlice";
import { AppDispatch } from "../store/store";

const Dashboard = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className="dashboard">
			<div className="shell shell--large">
				<div className="dashboard__inner">
					<div className="dashboard__header">
						<h1 className="h5">Project List</h1>

						<button
							className="btn btn--green"
							onClick={() => dispatch(openProjectCreateModal())}
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
