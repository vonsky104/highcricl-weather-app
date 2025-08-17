import {
	Cloud,
	CloudDrizzle,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	HelpCircle,
	type LucideIcon,
	Sun,
} from "lucide-react";

export type WeatherInfo = {
	code: number;
	label: string;
	description: string;
	icon: LucideIcon;
	color: string;
};

const WEATHER_CODE_MAP: Record<number, Omit<WeatherInfo, "code">> = {
	0: {
		label: "Clear",
		description: "Sunny",
		icon: Sun,
		color: "text-yellow-500",
	},
	1: {
		label: "Mainly clear",
		description: "Mostly sunny",
		icon: Sun,
		color: "text-yellow-500",
	},
	2: {
		label: "Partly cloudy",
		description: "Intermittent clouds",
		icon: CloudSun,
		color: "text-gray-500",
	},
	3: {
		label: "Overcast",
		description: "Cloudy sky",
		icon: Cloud,
		color: "text-gray-500",
	},

	45: {
		label: "Fog",
		description: "Fog",
		icon: CloudFog,
		color: "text-gray-400",
	},
	48: {
		label: "Rime fog",
		description: "Depositing rime fog",
		icon: CloudFog,
		color: "text-gray-400",
	},

	51: {
		label: "Light drizzle",
		description: "Light intensity drizzle",
		icon: CloudDrizzle,
		color: "text-blue-400",
	},
	53: {
		label: "Drizzle",
		description: "Moderate drizzle",
		icon: CloudDrizzle,
		color: "text-blue-400",
	},
	55: {
		label: "Heavy drizzle",
		description: "Dense drizzle",
		icon: CloudDrizzle,
		color: "text-blue-400",
	},

	56: {
		label: "Light freezing drizzle",
		description: "Icy drizzle",
		icon: CloudDrizzle,
		color: "text-blue-400",
	},
	57: {
		label: "Freezing drizzle",
		description: "Dense icy drizzle",
		icon: CloudDrizzle,
		color: "text-blue-400",
	},

	61: {
		label: "Light rain",
		description: "Light rain",
		icon: CloudRain,
		color: "text-blue-500",
	},
	63: {
		label: "Rain",
		description: "Moderate rain",
		icon: CloudRain,
		color: "text-blue-500",
	},
	65: {
		label: "Heavy rain",
		description: "Heavy intensity rain",
		icon: CloudRain,
		color: "text-blue-500",
	},

	66: {
		label: "Light freezing rain",
		description: "Light icy rain",
		icon: CloudRain,
		color: "text-blue-500",
	},
	67: {
		label: "Freezing rain",
		description: "Icy rain",
		icon: CloudRain,
		color: "text-blue-500",
	},

	71: {
		label: "Light snow",
		description: "Light snow fall",
		icon: CloudSnow,
		color: "text-blue-100",
	},
	73: {
		label: "Snow",
		description: "Moderate snow fall",
		icon: CloudSnow,
		color: "text-blue-100",
	},
	75: {
		label: "Heavy snow",
		description: "Heavy snow fall",
		icon: CloudSnow,
		color: "text-blue-100",
	},
	77: {
		label: "Snow grains",
		description: "Snow grains",
		icon: CloudSnow,
		color: "text-blue-100",
	},

	80: {
		label: "Light rain showers",
		description: "Brief, light showers",
		icon: CloudRain,
		color: "text-blue-500",
	},
	81: {
		label: "Rain showers",
		description: "Rain showers",
		icon: CloudRain,
		color: "text-blue-500",
	},
	82: {
		label: "Heavy rain showers",
		description: "Intense rain showers",
		icon: CloudRain,
		color: "text-blue-500",
	},

	85: {
		label: "Snow showers",
		description: "Light snow showers",
		icon: CloudSnow,
		color: "text-blue-100",
	},
	86: {
		label: "Heavy snow showers",
		description: "Heavy snow showers",
		icon: CloudSnow,
		color: "text-blue-100",
	},

	95: {
		label: "Thunderstorm",
		description: "Thunderstorm",
		icon: CloudLightning,
		color: "text-purple-500",
	},
	96: {
		label: "Thunderstorm w/ hail",
		description: "Thunder and slight hail",
		icon: CloudLightning,
		color: "text-purple-500",
	},
	99: {
		label: "Severe thunderstorm w/ hail",
		description: "Thunder and heavy hail",
		icon: CloudLightning,
		color: "text-purple-500",
	},
};

export function getWeatherInfo(code: number): WeatherInfo {
	const base = WEATHER_CODE_MAP[code];
	if (!base) {
		return {
			code,
			label: "Unknown",
			description: "Unrecognized weather code",
			icon: HelpCircle,
			color: "text-gray-400",
		};
	}

	return { code, ...base };
}
