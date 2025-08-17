import Temperature from "@/components/Temperature";
import WeatherIcon from "@/components/WeatherIcon";
import type { ICurrentWeatherForCity } from "@/types/weather.ts";
import { CloudOff } from "lucide-react";

interface ICityWeatherProps {
	data: ICurrentWeatherForCity | null;
}

const CityWeather = ({ data }: ICityWeatherProps) => {
	if (!data || !data.isFetched) {
		return (
			<div className="flex gap-2">
				<CloudOff size={16} />
			</div>
		);
	}

	return (
		<div className="flex gap-2">
			<WeatherIcon conditionCode={data.weatherCode} />
			<Temperature value={data.temperature} />
		</div>
	);
};

export default CityWeather;
