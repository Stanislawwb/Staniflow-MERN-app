import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
	const token = useSelector((state: RootState) => state.auth.token);

	return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
