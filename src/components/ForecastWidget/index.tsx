import DayBlock from "@/components/ForecastWidget/DayBlock";
import ErrorInfo from "@/components/ui/ErrorInfo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
	const { data, isFetching, isError, isPending } = useForecastWeatherQuery(
		currentPosition,
		forecastDays,
	);

	if (isFetching || isPending) {
		return (
			<div className="min-h-[240px] flex items-center justify-center bg-blue-300 p-6 rounded-xl border border-white">
				<LoadingSpinner />
			</div>
		);
	}

	if (!currentPosition || isError || !data || data.length <= 0) {
		return (
			<div className="min-h-[240px] flex items-center justify-center bg-blue-300 p-6 rounded-xl border border-white">
				<ErrorInfo />
			</div>
		);
	}

	return (
		<div className="bg-blue-300 p-6 rounded-xl border border-white">
			<h3 className="text-lg font-semibold text-foreground mb-4 text-center">
				{forecastDays}-Day Forecast
			</h3>

			{/* TODO: Potential improvement - introduce skeleton loaders for each dayblock instead of loading indicator */}
			<div className="flex overflow-x-auto justify-around gap-4">
				{data.map((day) => (
					<DayBlock key={day.date} {...day} />
				))}
			</div>
		</div>
	);
};

export default ForecastWidget;
