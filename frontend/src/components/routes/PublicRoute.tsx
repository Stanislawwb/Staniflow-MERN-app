import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
	const token = useSelector((state: RootState) => state.auth.token);

	return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
