import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="min-h-screen bg-blue-400">
			<div className="container mx-auto px-4 py-8 z-5">{children}</div>
		</div>
	);
};

export default Layout;
