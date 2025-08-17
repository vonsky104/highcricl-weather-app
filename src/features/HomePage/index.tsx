import CurrentWeather from "@/components/CurrentWeather";
import ForecastWidget from "@/components/ForecastWidget";
import useCurrentPosition from "@/hooks/useCurrentPosition";

const Index = () => {
	const currentPosition = useCurrentPosition();

	return (
		<div className="flex flex-col gap-6">
			<CurrentWeather currentPosition={currentPosition} />
			<ForecastWidget currentPosition={currentPosition} />
		</div>
	);
};

export default Index;
