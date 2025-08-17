import { ROUTES } from "@/config/routes.ts";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const GoBackButton = () => {
	const navigate = useNavigate();
	const handleNavigateBack = async () => {
		await navigate({ to: ROUTES.HOME_PAGE });
	};

	return (
		<button
			type="button"
			onClick={handleNavigateBack}
			className="flex gap-2 items-center cursor-pointer text-black hover:text-gray-400"
		>
			<ArrowLeft size={16} /> Go back
		</button>
	);
};

export default GoBackButton;
