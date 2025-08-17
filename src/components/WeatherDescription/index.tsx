import { getWeatherInfo } from "@/utils/weatherCodeToCondition.ts";

interface IWeatherDescriptionProps {
	conditionCode: number;
}

const WeatherDescription = ({ conditionCode }: IWeatherDescriptionProps) => {
	const { description } = getWeatherInfo(conditionCode);
	return <>{description}</>;
};

export default WeatherDescription;
