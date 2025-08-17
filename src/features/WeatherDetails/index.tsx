import LocationName from "@/features/WeatherDetails/LocationName";
import WeatherConditions from "@/features/WeatherDetails/WeatherConditions";

interface IWeatherDetailsPageProps {
	longitude: number;
	latitude: number;
}

const WeatherDetails = ({ longitude, latitude }: IWeatherDetailsPageProps) => {
	console.log(longitude, latitude);

	return (
		<div className="flex flex-col gap-6">
			<LocationName latitude={latitude} longitude={longitude} />
			<WeatherConditions longitude={longitude} latitude={latitude} />
		</div>
	);
};

export default WeatherDetails;
