import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../store/store";

const PrivateRoute = () => {
	const { token, isLoading } = useSelector((state: RootState) => state.auth);

	if (isLoading) {
		return null;
	}

	return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
