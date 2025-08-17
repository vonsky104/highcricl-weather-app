import CurrentWeather from "@/components/CurrentWeather";
import ForecastWidget from "@/components/ForecastWidget";
import SearchBar from "@/components/SearchBar";
import ErrorInfo from "@/components/ui/ErrorInfo";
import useCurrentPosition from "@/hooks/useCurrentPosition";

const HomePage = () => {
	const { currentPosition, geolocationError } = useCurrentPosition();

	return (
		<>
			<SearchBar />
			<div className="flex flex-col gap-6 mt-10">
				{geolocationError ? (
					// If the user encountered some problem with Geolocation, we have to immediately show error
					<div className="ml-auto mr-auto w-full md:w-1/2 min-h-[120px] flex items-center justify-center bg-blue-300 p-6 rounded-xl border border-white">
						<ErrorInfo error={geolocationError} />
					</div>
				) : (
					<>
						<CurrentWeather currentPosition={currentPosition} />
						<ForecastWidget currentPosition={currentPosition} />
					</>
				)}
			</div>
		</>
	);
};

export default HomePage;
