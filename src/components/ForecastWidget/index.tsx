import DayBlock from "@/components/ForecastWidget/DayBlock";
import useForecastWeatherQuery from "@/hooks/useForecastWeatherQuery";
import type { ICurrentPosition } from "@/types/position.ts";

interface IForecastWidgetProps {
	currentPosition: ICurrentPosition | null;
	forecastDays?: number;
}

const DEFAULT_FORECAST_DAYS = 5;

const ForecastWidget = ({
	currentPosition,
	forecastDays = DEFAULT_FORECAST_DAYS,
}: IForecastWidgetProps) => {
	const { data, isFetching, isError } = useForecastWeatherQuery(
		currentPosition,
		forecastDays,
	);

	// TODO: Add loaders and error states
	if (isFetching || isError || !data || data.length <= 0) {
		return null;
	}

	return (
		<div className="bg-glass border border-glass-border backdrop-blur-glass rounded-2xl p-6 shadow-glass animate-fade-in">
			<h3 className="text-lg font-semibold text-foreground mb-4 text-center">
				{forecastDays}-Day Forecast
			</h3>

			<div className="flex overflow-x-auto justify-around gap-4">
				{data.map((day) => (
					<DayBlock key={day.date} {...day} />
				))}
			</div>
		</div>
	);
};

export default ForecastWidget;
