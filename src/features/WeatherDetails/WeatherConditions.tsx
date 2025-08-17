import Temperature from "@/components/Temperature";
import WeatherDescription from "@/components/WeatherDescription";
import WeatherIcon from "@/components/WeatherIcon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentWeatherQuery from "@/hooks/useCurrentWeatherQuery";

interface IWeatherConditionsProps {
	longitude: number;
	latitude: number;
}

const WeatherConditions = ({
	longitude,
	latitude,
}: IWeatherConditionsProps) => {
	const {
		data: currentWeather,
		isFetching: isFetchingCurrentWeather,
		isError: isCurrentWeatherError,
	} = useCurrentWeatherQuery({ coords: { latitude, longitude } });

	if (isCurrentWeatherError) {
		return <h1 className="text-red-100">Error when fetching location name</h1>;
	}

	if (isFetchingCurrentWeather || !currentWeather) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-lg">
				<Temperature value={currentWeather.current.temperature_2m} />
			</p>
			<WeatherDescription conditionCode={currentWeather.current.weather_code} />
			<WeatherIcon
				conditionCode={currentWeather.current.weather_code}
				size={256}
			/>
			<div>
				Wind speed: {currentWeather.current.wind_speed_10m.toFixed(2)} km/h
			</div>
			<div>Humidity: {currentWeather.current.relative_humidity_2m}%</div>
		</div>
	);
};

export default WeatherConditions;
