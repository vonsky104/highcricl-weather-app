import { fetchWeatherApi } from "openmeteo";

const url = "https://api.open-meteo.com/v1/forecast";

const getCurrentParams = (
	latitude: number | number[],
	longitude: number | number[],
) => ({
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

export const getCurrentWeatherForMultipleLocations = async (
	latitudes: number[],
	longitudes: number[],
) => {
	return await fetchWeatherApi(url, getCurrentParams(latitudes, longitudes));
};
