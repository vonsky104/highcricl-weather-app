import ky from "@/api/ky.ts";

export interface ICurrentLocation {
	latitude: number;
	longitude: number;
	countryName: string;
	city: string;
}

const BASE_URL = "https://api.bigdatacloud.net/data";

export const getCurrentLocation = async (
	latitude: number,
	longitude: number,
) => {
	return ky
		.get(`reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`, {
			prefixUrl: BASE_URL,
		})
		.json<ICurrentLocation>();
};
