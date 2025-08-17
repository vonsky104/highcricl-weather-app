import GoBackButton from "@/features/WeatherDetails/GoBackButton.tsx";
import LocationName from "@/features/WeatherDetails/LocationName";
import WeatherConditions from "@/features/WeatherDetails/WeatherConditions";

interface IWeatherDetailsPageProps {
	longitude: number;
	latitude: number;
}

const WeatherDetails = ({ longitude, latitude }: IWeatherDetailsPageProps) => {
	return (
		<div className="flex flex-col gap-6">
			<div className="ml-auto mr-auto w-full bg-blue-300 p-6 rounded-xl border border-white relative">
				<div className="xs:absolute top-8 left-8">
					<GoBackButton />
				</div>
				<div className="flex flex-col justify-between items-center gap-2">
					<div className="flex flex-col gap-0">
						<LocationName latitude={latitude} longitude={longitude} />
					</div>
					<div className="flex flex-row items-center gap-4">
						<WeatherConditions longitude={longitude} latitude={latitude} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeatherDetails;
