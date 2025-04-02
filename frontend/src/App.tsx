import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import SingleProjectPage from "./pages/SingleProjectPage";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AuthProvider from "./components/AuthProvider";

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
				<Layout />
			</AuthProvider>
		</Router>
	);
}

export default App;
