import { fetchWeatherApi } from "openmeteo";

const url = "https://api.open-meteo.com/v1/forecast";

// TODO: Remove after not useful for reference anymore
// const defaultParams = {
// 	daily: [
// 		"weather_code",
// 		"temperature_2m_max",
// 		"temperature_2m_min",
// 		"wind_speed_10m_max",
// 	],
// 	hourly: [
// 		"temperature_2m",
// 		"relative_humidity_2m",
// 		"precipitation",
// 		"weather_code",
// 		"temperature_80m",
// 		"wind_direction_80m",
// 		"wind_speed_80m",
// 		"apparent_temperature",
// 	],
// 	current: [
// 		"weather_code",
// 		"temperature_2m",
// 		"wind_speed_10m",
// 		"wind_direction_10m",
// 	],
// 	timezone: "auto",
// 	forecast_days: 1,
// };

const getCurrentParams = (latitude: number, longitude: number) => ({
	latitude,
	longitude,
	current: [
		"weather_code",
		"temperature_2m",
		"wind_speed_10m",
		"relative_humidity_2m",
	],
	timezone: "auto",
	forecast_days: 1,
});

const getForecastParams = (
	latitude: number,
	longitude: number,
	forecastDays: number,
) => ({
	longitude,
	latitude,
	forecast_days: forecastDays,
	daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
	timezone: "auto",
});

export const getCurrentWeather = async (
	latitude: number,
	longitude: number,
) => {
	return await fetchWeatherApi(url, getCurrentParams(latitude, longitude));
};

export const getForecastWeather = async (
	latitude: number,
	longitude: number,
	forecastDays: number,
) => {
	return await fetchWeatherApi(
		url,
		getForecastParams(latitude, longitude, forecastDays),
	);
};
