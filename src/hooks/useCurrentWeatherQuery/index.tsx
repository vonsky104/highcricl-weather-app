import { getCurrentWeather } from "@/api/weather.ts";
import type { ICurrentPosition } from "@/types/position.ts";
import type { ICurrentWeather } from "@/types/weather.ts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useCurrentWeatherQuery = (currentPosition: ICurrentPosition | null) => {
	return useQuery<ICurrentWeather | null>({
		queryKey: [
			"current-weather",
			`${currentPosition?.coords.latitude}:${currentPosition?.coords.longitude}`,
		],
		queryFn: async () => {
			if (!currentPosition) {
				return null;
			}

			const responses = await getCurrentWeather(
				currentPosition.coords.latitude,
				currentPosition.coords.longitude,
			);

			const response = responses[0];

			const utcOffsetSeconds = response.utcOffsetSeconds();
			const current = response.current();
			if (!current) {
				toast.error("Error when fetching current weather");
				return null;
			}

			return {
				time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
				weatherCode: current.variables(0)!.value(),
				temperature: current.variables(1)!.value(),
				windSpeed: current.variables(2)!.value(),
				humidity: current.variables(3)!.value(),
			};
		},
		enabled: currentPosition !== null,
	});
};

export default useCurrentWeatherQuery;
