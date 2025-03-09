import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";

function Layout() {
	const location = useLocation();

	const noHeaderFooterRoutes = ["/login", "/register", "*"];

	const isNotFound = !["/", "/login", "/register", "dashboard"].includes(
		location.pathname
	);

	const hideHeaderFooter =
		noHeaderFooterRoutes.includes(location.pathname) || isNotFound;

	return (
		<>
			{!hideHeaderFooter && <Header />}

			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>

			{!hideHeaderFooter && <Footer />}
		</>
	);
}

function App() {
	return (
		<Router>
			<Layout />
		</Router>
	);
}

export default App;
