import type { ICity } from "@/api/getCities.ts";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/config/routes.ts";
import useSearchCitiesQuery from "@/hooks/useSearchCitiesQuery";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const { data } = useSearchCitiesQuery(searchTerm);
	const navigate = useNavigate();

	// FIXME: Remove - for testing purposes
	// const data: ICities = {
	// 	results: [
	// 		{
	// 			name: "Krakow",
	// 			id: 1,
	// 			country: "Poland",
	// 			latitude: 50.06143,
	// 			longitude: 19.93658,
	// 		},
	// 	],
	// };

	const handleCityClick = async (city: ICity) => {
		setSearchTerm("");
		setIsOpen(false);
		await navigate({
			to: `${ROUTES.WEATHER_DETAILS_PAGE}`,
			search: { longitude: city.longitude, latitude: city.latitude },
		});
	};

	return (
		<div className="relative w-full max-w-md mx-auto z-10 pb-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<Input
					type="text"
					placeholder="Search cities... (min 3 characters)"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setIsOpen(e.target.value.length > 0);
					}}
					onFocus={() => setIsOpen(searchTerm.length > 0)}
					onBlur={() => setTimeout(() => setIsOpen(false), 200)}
					className="pl-10 bg-glass border-glass-border backdrop-blur-glass shadow-glass text-foreground placeholder:text-muted-foreground"
				/>
			</div>

			{isOpen && data && data.results.length > 0 && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-glass border border-glass-border backdrop-blur-glass rounded-lg shadow-glass overflow-hidden z-50">
					{data.results.map((city) => (
						<button
							type="button"
							key={city.id}
							onClick={() => handleCityClick(city)}
							className="w-full px-4 py-3 text-left bg-blue-100 hover:bg-accent/20 flex items-center gap-3 group"
						>
							<MapPin className="w-4 h-4 text-primary group-hover:scale-110" />
							<div>
								<div className="font-medium text-foreground">{city.name}</div>
								<div className="text-sm text-muted-foreground">
									{city.country} • {city.latitude.toFixed(2)},{" "}
									{city.longitude.toFixed(2)}
								</div>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
