import { useSelector } from "react-redux";
import {
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./components/AuthProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ModalManager from "./components/ModalManager";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Register";
import SingleProjectPage from "./pages/SingleProjectPage";
import { RootState } from "./store/store";

function Layout() {
	const location = useLocation();

	const noHeaderFooterRoutes = ["/login", "/register", "*"];

	const isNotFound =
		!["/", "/login", "/register", "/dashboard"].includes(
			location.pathname
		) && !location.pathname.startsWith("/projects/");

	const hideHeaderFooter =
		noHeaderFooterRoutes.includes(location.pathname) || isNotFound;

	return (
		<>
			{!hideHeaderFooter && <Header />}

			<Routes>
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>

				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route
						path="/projects/:projectId"
						element={<SingleProjectPage />}
					/>
				</Route>

				<Route path="/" element={<Homepage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>

			{!hideHeaderFooter && <Footer />}

			<ModalManager />
		</>
	);
}

function App() {
	const isLoading = useSelector((state: RootState) => state.auth.isLoading);

	if (isLoading) {
		return null;
	}
	return (
		<Router>
			<AuthProvider>
				<>
					<Layout />
					<ToastContainer position="bottom-right" autoClose={4000} />
				</>
			</AuthProvider>
		</Router>
	);
}

export default App;
