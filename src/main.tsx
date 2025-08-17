import {
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { ROUTES } from "@/config/routes.ts";
import HomePage from "@/features/HomePage";
import Layout from "@/features/Layout";
import WeatherDetails from "@/features/WeatherDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import reportWebVitals from "./reportWebVitals.ts";

// TODO: Add docker
const queryClient = new QueryClient();

const rootRoute = createRootRoute({
	component: () => (
		<Layout>
			<Outlet />
			<TanStackRouterDevtools />
		</Layout>
	),
});

const homePageRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage,
});

const weatherDetailsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/weather-details",
	component: function WeatherDetailsPageWrapper() {
		const { latitude, longitude } = weatherDetailsRoute.useSearch();
		const navigate = useNavigate();
		const isMissing = latitude === undefined || longitude === undefined;
		useEffect(() => {
			if (isMissing) {
				toast.error("Missing latitude or longitude");
				navigate({ to: ROUTES.HOME_PAGE });
			}
		}, [isMissing, navigate]);

		return isMissing ? null : (
			<WeatherDetails longitude={longitude} latitude={latitude} />
		);
	},
	validateSearch: (search: Record<string, string>) => ({
		latitude: search?.latitude ? Number(search?.latitude) : undefined,
		longitude: search?.longitude ? Number(search?.longitude) : undefined,
	}),
});

const routeTree = rootRoute.addChildren([homePageRoute, weatherDetailsRoute]);

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				{/* TODO: Change styling of Toaster for notifications */}
				<Toaster position="bottom-center" />
			</QueryClientProvider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
