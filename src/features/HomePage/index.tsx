import CurrentWeather from "@/components/CurrentWeather";
import ForecastWidget from "@/components/ForecastWidget";
import SearchBar from "@/components/SearchBar";
import useCurrentPosition from "@/hooks/useCurrentPosition";

const Index = () => {
	const currentPosition = useCurrentPosition();

	return (
		<>
			<SearchBar />
			<div className="flex flex-col gap-6 mt-10">
				<CurrentWeather currentPosition={currentPosition} />
				<ForecastWidget currentPosition={currentPosition} />
			</div>
		</>
	);
};

export default Index;
