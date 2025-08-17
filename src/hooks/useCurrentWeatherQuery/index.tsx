import { getCurrentWeather } from "@/api/weather.ts";
import type { ICurrentPosition } from "@/types/position.ts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useCurrentWeatherQuery = (currentPosition: ICurrentPosition | null) => {
	return useQuery({
		queryKey: [
			"current-weather",
			`${currentPosition?.coords.latitude}:${currentPosition?.coords.longitude}`,
		],
		queryFn: async () => {
			// TODO: Add type for return values
			if (!currentPosition) {
				return;
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

			const weatherData = {
				current: {
					time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
					weather_code: current.variables(0)!.value(),
					temperature_2m: current.variables(1)!.value(),
					wind_speed_10m: current.variables(2)!.value(),
					relative_humidity_2m: current.variables(3)!.value(),
				},
			};

			return weatherData;
		},
		enabled: currentPosition !== null,
	});
};

export default useCurrentWeatherQuery;
