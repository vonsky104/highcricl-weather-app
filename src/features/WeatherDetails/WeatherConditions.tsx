import Temperature from "@/components/Temperature";
import WeatherDescription from "@/components/WeatherDescription";
import WeatherIcon from "@/components/WeatherIcon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentWeatherQuery from "@/hooks/useCurrentWeatherQuery";
import { Droplet, Wind } from "lucide-react";

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
		isPending,
	} = useCurrentWeatherQuery({ coords: { latitude, longitude } });

	if (isCurrentWeatherError) {
		return <h1 className="text-red-100">Error when fetching location name</h1>;
	}

	if (isFetchingCurrentWeather || !currentWeather || isPending) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col gap-4 items-center mt-6">
			<p className="text-4xl">
				<Temperature value={currentWeather.current.temperature_2m} />
			</p>
			<p className="text-xl">
				<WeatherDescription
					conditionCode={currentWeather.current.weather_code}
				/>
			</p>
			<WeatherIcon
				conditionCode={currentWeather.current.weather_code}
				size={300}
			/>
			<div className="flex gap-2 items-center">
				<Wind size={32} /> {currentWeather.current.wind_speed_10m.toFixed(2)}{" "}
				km/h
			</div>
			<div className="flex gap-2 items-center">
				<Droplet size={32} /> {currentWeather.current.relative_humidity_2m}%
			</div>
		</div>
	);
};

export default WeatherConditions;
