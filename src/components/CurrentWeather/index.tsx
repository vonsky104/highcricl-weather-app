import Temperature from "@/components/Temperature";
import WeatherDescription from "@/components/WeatherDescription";
import WeatherIcon from "@/components/WeatherIcon";
import ErrorInfo from "@/components/ui/ErrorInfo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentLocationQuery from "@/hooks/useCurrentLocationQuery";
import useCurrentWeatherQuery from "@/hooks/useCurrentWeatherQuery";
import type { ICurrentPosition } from "@/types/position.ts";

interface ICurrentWeatherProps {
	currentPosition: ICurrentPosition | null;
}

const CurrentWeather = ({ currentPosition }: ICurrentWeatherProps) => {
	const {
		data: currentLocation,
		isFetching: isFetchingCurrentLocation,
		isError: isFetchingCurrentLocationError,
		isPending: isPendingCurrentLocation,
	} = useCurrentLocationQuery(currentPosition);
	const {
		data: currentWeather,
		isFetching: isFetchingCurrentWeather,
		isError: isFetchingCurrentWeatherError,
		isPending: isPendingCurrentWeather,
	} = useCurrentWeatherQuery(currentPosition);

	// TODO: Potential improvement - introduce skeleton loader
	if (
		isFetchingCurrentLocation ||
		isFetchingCurrentWeather ||
		isPendingCurrentLocation ||
		isPendingCurrentWeather
	) {
		return (
			<div className="ml-auto mr-auto w-full md:w-1/2 min-h-[120px] flex items-center justify-center bg-blue-300 p-6 rounded-xl border border-white">
				<LoadingSpinner />
			</div>
		);
	}

	if (
		isFetchingCurrentWeatherError ||
		isFetchingCurrentLocationError ||
		!currentPosition ||
		!currentLocation ||
		!currentWeather
	) {
		return (
			<div className="ml-auto mr-auto w-full md:w-1/2 min-h-[120px] flex items-center justify-center bg-blue-300 p-6 rounded-xl border border-white">
				<ErrorInfo />
			</div>
		);
	}

	return (
		<div className="ml-auto mr-auto w-full md:w-1/2 bg-blue-300 p-6 rounded-xl border border-white">
			<div className="flex flex-col xs:flex-row justify-between items-center gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-4xl font-semibold text-foreground">
						{currentLocation.city}
					</h2>
					<p className="text-sm text-muted-foreground">
						{currentLocation.countryName} -{" "}
						{currentPosition.coords.latitude.toFixed(2)},{" "}
						{currentPosition.coords.longitude.toFixed(2)}
					</p>
				</div>
				<div className="flex flex-row items-center gap-4">
					<div>
						<WeatherIcon conditionCode={currentWeather.weatherCode} size={64} />
					</div>
					<div>
						<div className="text-4xl font-bold text-foreground">
							<Temperature value={currentWeather.temperature} />
						</div>
						<WeatherDescription conditionCode={currentWeather.weatherCode} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CurrentWeather;
