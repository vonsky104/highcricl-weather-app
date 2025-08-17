import { getWeatherInfo } from "@/utils/weatherCodeToCondition.ts";

interface IWeatherIconProps {
	conditionCode: number;
	size?: number;
	className?: string;
}

const WeatherIcon = ({ conditionCode, size = 24 }: IWeatherIconProps) => {
	const { icon: Icon, color } = getWeatherInfo(conditionCode);
	return (
		<div className="inline-flex items-center justify-center">
			<Icon size={size} className={`${color}`} />
		</div>
	);
};

export default WeatherIcon;
