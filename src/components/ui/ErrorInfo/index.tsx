import { CloudOff } from "lucide-react";

interface IErrorInfoProps {
	error?: string | null;
}

const DEFAULT_ERROR = "Something went wrong while fetching data.";

const ErrorInfo = ({ error }: IErrorInfoProps) => {
	return (
		<div className="flex gap-2 items-center">
			<CloudOff size={32} /> {error ?? DEFAULT_ERROR}
		</div>
	);
};

export default ErrorInfo;
