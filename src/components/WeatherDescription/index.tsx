import { getWeatherInfo } from "@/utils/weatherCodeToCondition.ts";

interface IWeatherDescriptionProps {
	conditionCode: number;
}

const WeatherDescription = ({ conditionCode }: IWeatherDescriptionProps) => {
	const { description } = getWeatherInfo(conditionCode);
	return <p className="text-muted-foreground capitalize">{description}</p>;
};

export default WeatherDescription;
