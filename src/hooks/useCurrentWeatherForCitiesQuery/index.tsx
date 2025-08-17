import { getCurrentWeatherForMultipleLocations } from "@/api/weather.ts";
import type { ICurrentWeatherForCity } from "@/types/weather.ts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useCurrentWeatherForCitiesQuery = (
	longitudes: number[],
	latitudes: number[],
) => {
	const citiesLongitudesAndLatitudesKey = useMemo(() => {
		return longitudes.concat(latitudes).join("");
	}, [longitudes, latitudes]);

	return useQuery<ICurrentWeatherForCity[] | null>({
		queryKey: ["current-weather-cities", citiesLongitudesAndLatitudesKey],
		queryFn: async () => {
			if (
				!longitudes ||
				!latitudes ||
				longitudes.length <= 0 ||
				latitudes.length <= 0
			) {
				return null;
			}

			const responses = await getCurrentWeatherForMultipleLocations(
				latitudes,
				longitudes,
			);

			const result: ICurrentWeatherForCity[] = [];

			for (let i = 0; i < responses.length; i++) {
				const response = responses[i];
				const current = response.current();
				if (!current) {
					result.push({ isFetched: false });
					console.error(
						`Not fetched weather for location: ${longitudes[i]}:${latitudes[i]}`,
					);
				} else {
					result.push({
						weatherCode: current.variables(0)!.value(),
						temperature: current.variables(1)!.value(),
						isFetched: true,
					});
				}
			}

			return result;
		},
		enabled:
			longitudes && latitudes && longitudes.length > 0 && latitudes.length > 0,
	});
};

export default useCurrentWeatherForCitiesQuery;
