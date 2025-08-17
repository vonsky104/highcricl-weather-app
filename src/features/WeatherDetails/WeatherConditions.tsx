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
		return (
			<div className="flex flex-col gap-4 items-center mt-6">
				<h1 className="text-4xl">Error when fetching Weather Conditions</h1>
			</div>
		);
	}

	if (isFetchingCurrentWeather || !currentWeather || isPending) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col gap-4 items-center mt-6">
			<p className="text-4xl">
				<Temperature value={currentWeather.temperature} />
			</p>
			<p className="text-xl">
				<WeatherDescription conditionCode={currentWeather.weatherCode} />
			</p>
			<WeatherIcon conditionCode={currentWeather.weatherCode} size={300} />
			<div className="flex gap-2 items-center">
				<Wind size={32} /> {currentWeather.windSpeed.toFixed(2)} km/h
			</div>
			<div className="flex gap-2 items-center">
				<Droplet size={32} /> {currentWeather.humidity}%
			</div>
		</div>
	);
};

export default WeatherConditions;
