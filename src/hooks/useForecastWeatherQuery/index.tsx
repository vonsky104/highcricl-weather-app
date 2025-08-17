import { getForecastWeather } from "@/api/weather.ts";
import type { ICurrentPosition } from "@/types/position.ts";
import type { IForecastDay } from "@/types/weather.ts";
import { formatDate } from "@/utils/formatDate.ts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useForecastWeatherQuery = (
	currentPosition: ICurrentPosition | null,
	forecastDays: number,
) => {
	return useQuery<IForecastDay[]>({
		queryKey: [
			"forecast-weather",
			`${currentPosition?.coords.latitude}:${currentPosition?.coords.longitude}`,
			forecastDays,
		],
		queryFn: async () => {
			if (!currentPosition || !forecastDays) {
				return [];
			}

			const responses = await getForecastWeather(
				currentPosition.coords.latitude,
				currentPosition.coords.longitude,
				forecastDays,
			);

			const response = responses[0];

			const utcOffsetSeconds = response.utcOffsetSeconds();
			const daily = response.daily();
			if (!daily) {
				toast.error("Error when fetching forecast weather");
				return [];
			}

			const weatherData = {
				daily: {
					time: [
						...Array(
							(Number(daily.timeEnd()) - Number(daily.time())) /
								daily.interval(),
						),
					].map(
						(_, i) =>
							new Date(
								(Number(daily.time()) +
									i * daily.interval() +
									utcOffsetSeconds) *
									1000,
							),
					),
					weather_code: daily.variables(0)!.valuesArray(),
					temperature_2m_max: daily.variables(1)!.valuesArray(),
					temperature_2m_min: daily.variables(2)!.valuesArray(),
				},
			};

			const result: IForecastDay[] = [];
			for (let i = 0; i < forecastDays; i++) {
				const { date, dayName } = formatDate(weatherData.daily.time[i]);

				const forecastDay: IForecastDay = {
					date,
					dayName,
					high: weatherData.daily.temperature_2m_max?.[i]
						? Math.ceil(weatherData.daily.temperature_2m_max?.[i])
						: 0,
					low: weatherData.daily.temperature_2m_min?.[i]
						? Math.ceil(weatherData.daily.temperature_2m_min?.[i])
						: 0,
					conditionCode: weatherData.daily.weather_code?.[i] ?? 0,
				};

				result.push(forecastDay);
			}

			return result;
		},
		enabled: currentPosition !== null,
	});
};

export default useForecastWeatherQuery;
