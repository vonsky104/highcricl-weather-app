import SearchBar from "@/components/SearchBar";
import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="min-h-screen bg-blue-100">
			<div className="container mx-auto px-4 py-8">
				<SearchBar />
				{children}
			</div>
			<div className="text-center w-full fixed bottom-4">
				<p className="text-white/60 text-sm">Chris Wasowicz</p>
			</div>
		</div>
	);
};

export default Layout;
