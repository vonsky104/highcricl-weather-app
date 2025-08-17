import { CloudOff } from "lucide-react";

const ErrorInfo = () => {
	return (
		<div className="flex gap-2 items-center">
			<CloudOff size={32} /> Something went wrong while fetching data.
		</div>
	);
};

export default ErrorInfo;
