import Temperature from "@/components/Temperature";
import WeatherDescription from "@/components/WeatherDescription";
import WeatherIcon from "@/components/WeatherIcon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentLocationQuery from "@/hooks/useCurrentLocationQuery";
import useCurrentWeatherQuery from "@/hooks/useCurrentWeatherQuery";
import type { ICurrentPosition } from "@/types/position.ts";
import { MapPin } from "lucide-react";

interface ICurrentWeatherProps {
	currentPosition: ICurrentPosition | null;
}

const CurrentWeather = ({ currentPosition }: ICurrentWeatherProps) => {
	const { data: currentLocation, isFetching: isFetchingCurrentLocation } =
		useCurrentLocationQuery(currentPosition);
	const { data: currentWeather, isFetching: isFetchingCurrentWeather } =
		useCurrentWeatherQuery(currentPosition);

	// TODO: Move currentLocation and currentWeather condition to error state
	if (
		isFetchingCurrentLocation ||
		isFetchingCurrentWeather ||
		!currentPosition ||
		!currentLocation ||
		!currentWeather
	) {
		return (
			<div className="bg-glass border border-glass-border backdrop-blur-glass rounded-2xl p-6 shadow-glass animate-pulse">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="bg-glass border border-glass-border backdrop-blur-glass rounded-2xl p-6 shadow-glass animate-fade-in">
			<div className="flex items-center gap-2 mb-4">
				<MapPin className="w-5 h-5 text-primary" />
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						{currentLocation.city}
					</h2>
					<p className="text-sm text-muted-foreground">
						{currentLocation.countryName} •{" "}
						{currentPosition.coords.latitude.toFixed(2)},{" "}
						{currentPosition.coords.longitude.toFixed(2)}
					</p>
				</div>
				<div className="flex flex-row items-center gap-4">
					<div className="animate-float">
						<WeatherIcon
							conditionCode={currentWeather.current.weather_code}
							size={64}
						/>
					</div>
					<div>
						<div className="text-4xl font-bold text-foreground">
							<Temperature value={currentWeather.current.temperature_2m} />
						</div>
					</div>
					<WeatherDescription
						conditionCode={currentWeather.current.weather_code}
					/>
				</div>
			</div>
		</div>
	);
};

export default CurrentWeather;
