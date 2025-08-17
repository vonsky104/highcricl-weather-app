import type { ICurrentPosition } from "@/types/position.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useCurrentPosition = (): {
	currentPosition: ICurrentPosition | null;
	geolocationError: string | null;
} => {
	const [currentPosition, setCurrentPosition] =
		useState<ICurrentPosition | null>(null);
	const [geolocationError, setGeolocationError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			toast.error("Geolocation is not supported in your browser.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCurrentPosition(position);
			},
			(geolocationError) => {
				toast.error(geolocationError.message);
				setGeolocationError(geolocationError.message);
			},
		);
	}, []);

	return { currentPosition, geolocationError };
};

export default useCurrentPosition;
