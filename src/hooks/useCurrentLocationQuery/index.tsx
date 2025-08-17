import { getCurrentLocation } from "@/api/getCurrentLocation.ts";
import type { ICurrentPosition } from "@/types/position.ts";
import { useQuery } from "@tanstack/react-query";

const useCurrentLocationQuery = (currentPosition: ICurrentPosition | null) => {
	return useQuery({
		queryKey: ["current-location"],
		queryFn: async () => {
			if (!currentPosition) {
				return;
			}

			return getCurrentLocation(
				currentPosition.coords.latitude,
				currentPosition.coords.longitude,
			);
		},
		enabled: currentPosition !== null,
	});
};

export default useCurrentLocationQuery;
