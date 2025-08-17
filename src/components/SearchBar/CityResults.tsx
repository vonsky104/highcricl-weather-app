import type { ICity } from "@/api/getCities.ts";
import CityWeather from "@/components/SearchBar/CityWeather.tsx";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentWeatherForCitiesQuery from "@/hooks/useCurrentWeatherForCitiesQuery";
import { useMemo } from "react";

interface ICityResultsProps {
	cities: ICity[];
	handleCityClick: (city: ICity) => void;
}

const CityResults = ({ cities, handleCityClick }: ICityResultsProps) => {
	const longitudes = useMemo(() => cities.map((c) => c.longitude), [cities]);
	const latitudes = useMemo(() => cities.map((c) => c.latitude), [cities]);
	const { data, isFetching } = useCurrentWeatherForCitiesQuery(
		longitudes,
		latitudes,
	);
	return (
		<div className="absolute top-10 left-0 right-0 bg-blue-200 border rounded-lg overflow-hidden z-50">
			{cities.map((city, index) => (
				<button
					type="button"
					key={city.id}
					onClick={() => handleCityClick(city)}
					className="w-full px-4 py-3 text-left bg-blue-200 hover:bg-blue-300 cursor-pointer flex items-center gap-3 group justify-between"
				>
					<div>
						<div className="font-medium text-foreground">{city.name}</div>
						<div className="text-sm text-muted-foreground">
							{city.country} - {city.latitude.toFixed(2)},{" "}
							{city.longitude.toFixed(2)}
						</div>
					</div>
					<div>
						{isFetching ? (
							<LoadingSpinner />
						) : (
							<CityWeather data={data ? data[index] : null} />
						)}
					</div>
				</button>
			))}
		</div>
	);
};

export default CityResults;
