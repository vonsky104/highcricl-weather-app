import Temperature from "@/components/Temperature";
import WeatherIcon from "@/components/WeatherIcon";
import type { IForecastDay } from "@/types/weather.ts";
import { getWeatherInfo } from "@/utils/weatherCodeToCondition.ts";

const DayBlock = ({
	date,
	dayName,
	high,
	low,
	conditionCode,
}: IForecastDay) => {
	const { description } = getWeatherInfo(conditionCode);

	return (
		<div className="flex flex-col gap-1 min-w-[100px] items-center justify-between p-3 rounded-xl hover:bg-accent/10">
			<div className="flex-1">
				<p className="font-medium text-foreground text-center">{dayName}</p>
				<p className="text-sm text-muted-foreground text-center">{date}</p>
			</div>

			<div className="flex-1 flex justify-center">
				<div className="group-hover:scale-110 transition-transform duration-200">
					<WeatherIcon conditionCode={conditionCode} size={46} />
				</div>
			</div>

			<div className="flex-1 text-center">
				<p className="text-sm font-medium text-foreground capitalize">
					{description}
				</p>
			</div>

			<div className="flex-1 text-right">
				<div className="flex items-center justify-end gap-2">
					<span className="font-semibold text-foreground">
						<Temperature value={high} />
					</span>
					<span className="text-muted-foreground">
						<Temperature value={low} />
					</span>
				</div>
			</div>
		</div>
	);
};

export default DayBlock;
