import ky from "@/api/ky.ts";

export interface ICity {
	id: number;
	name: string;
	country: string;
	latitude: number;
	longitude: number;
}

export interface ICities {
	results: ICity[];
	isMoreCharsRequired?: boolean;
}

const BASE_URL = "https://geocoding-api.open-meteo.com/v1";
const COUNT = 10;

export const getCities = async (searchParam: string) => {
	return ky
		.get(`search?name=${searchParam}&count=${COUNT}&language=en&format=json`, {
			prefixUrl: BASE_URL,
		})
		.json<ICities>();
};
