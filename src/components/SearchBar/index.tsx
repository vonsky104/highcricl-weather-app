import type { ICity } from "@/api/getCities.ts";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/config/routes.ts";
import useSearchCitiesQuery from "@/hooks/useSearchCitiesQuery";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(true);
	const { data } = useSearchCitiesQuery(searchTerm);
	const navigate = useNavigate();

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
					className="pl-10 !bg-blue-300 border shadow-lg text-foreground placeholder:text-muted-foreground"
				/>
			</div>

			{isOpen && data && data.results.length > 0 && (
				<div className="absolute top-10 left-0 right-0 bg-blue-200 border rounded-lg overflow-hidden z-50">
					{data.results.map((city) => (
						<button
							type="button"
							key={city.id}
							onClick={() => handleCityClick(city)}
							className="w-full px-4 py-3 text-left bg-blue-200 hover:bg-blue-300 cursor-pointer flex items-center gap-3 group"
						>
							<div>
								<div className="font-medium text-foreground">{city.name}</div>
								<div className="text-sm text-muted-foreground">
									{city.country} - {city.latitude.toFixed(2)},{" "}
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
