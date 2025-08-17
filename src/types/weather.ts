export interface IForecastDay {
	date: string;
	dayName: string;
	high: number;
	low: number;
	conditionCode: number;
}

export interface ICurrentWeather {
	time: Date;
	weatherCode: number;
	temperature: number;
	windSpeed: number;
	humidity: number;
}

export interface ICurrentWeatherFetched {
	weatherCode: number;
	temperature: number;
	isFetched: true;
}

export interface ICurrentWeatherNotFetched {
	isFetched: false;
}

export type ICurrentWeatherForCity =
	| ICurrentWeatherFetched
	| ICurrentWeatherNotFetched;
