import { type ICities, getCities } from "@/api/getCities.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 300;

const useSearchCitiesQuery = (searchParamRaw?: string) => {
	const [debouncedSearch, setDebouncedSearch] = useState<string>("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(
				searchParamRaw && searchParamRaw.length >= MIN_SEARCH_LENGTH
					? searchParamRaw
					: "",
			);
		}, DEBOUNCE_MS);

		return () => clearTimeout(handler);
	}, [searchParamRaw]);

	return useQuery<ICities>({
		queryKey: ["search-cities", debouncedSearch],
		queryFn: async () => {
			if (!debouncedSearch) {
				return {
					results: [],
					isMoreCharsRequired: true,
				};
			}

			return await getCities(debouncedSearch);
		},
	});
};

export default useSearchCitiesQuery;
