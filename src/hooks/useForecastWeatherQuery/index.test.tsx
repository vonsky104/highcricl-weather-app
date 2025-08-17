import { getForecastWeather } from "@/api/weather.ts";
import { formatDate } from "@/utils/formatDate.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import useForecastWeatherQuery from "./";

vi.mock("@/api/weather.ts", () => ({
	getForecastWeather: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: { error: vi.fn() },
}));

vi.mock("@/utils/formatDate.ts", () => ({
	formatDate: vi.fn((d: Date) => ({
		date: d.toISOString().slice(0, 10),
		dayName: "X",
	})),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	// @ts-expect-error simplified provider typing is fine for tests
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

const INTERVAL = 86400; // 1 day in seconds

// Mocked forecast response
const makeForecastResponse = ({
	utcOffsetSeconds,
	days,
	weatherCodes,
	tMax,
	tMin,
}: {
	utcOffsetSeconds: number;
	days: number;
	weatherCodes: number[];
	tMax: number[];
	tMin: number[];
}) => {
	const dailyObj = {
		time: () => 0,
		timeEnd: () => INTERVAL * days,
		interval: () => INTERVAL,
		variables: (i: number) => ({
			valuesArray: () => [weatherCodes, tMax, tMin][i] ?? [],
		}),
	};
	return {
		utcOffsetSeconds: () => utcOffsetSeconds,
		daily: () => dailyObj,
	};
};

describe("useForecastWeatherQuery", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("does not run when currentPosition is null", () => {
		const { result } = renderHook(() => useForecastWeatherQuery(null, 5), {
			wrapper: createWrapper(),
		});

		expect(getForecastWeather).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetching).toBe(false);
	});

	it("does not run when forecastDays is 0", async () => {
		const pos = { coords: { latitude: 52.2297, longitude: 21.0122 } };

		const { result } = renderHook(() => useForecastWeatherQuery(pos, 0), {
			wrapper: createWrapper(),
		});

		expect(getForecastWeather).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetching).toBe(false);
	});

	it("fetches and maps forecast data correctly", async () => {
		const pos = { coords: { latitude: 52.2297, longitude: 21.0122 } };
		const days = 3;

		const utcOffsetSeconds = 7200; // 2h

		const weatherCodes = [10, 20, 30];
		const tMax = [25.2, 26.7, 24.1];
		const tMin = [15.4, 16.3, 14.9];

		const response = makeForecastResponse({
			utcOffsetSeconds,
			days,
			weatherCodes,
			tMax,
			tMin,
		});

		(getForecastWeather as unknown as Mock).mockResolvedValueOnce([response]);

		const { result } = renderHook(() => useForecastWeatherQuery(pos, days), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(getForecastWeather).toHaveBeenCalledWith(
			pos.coords.latitude,
			pos.coords.longitude,
			days,
		);

		const expectedDates = Array.from({ length: days }, (_, i) =>
			new Date((i * INTERVAL + utcOffsetSeconds) * 1000)
				.toISOString()
				.slice(0, 10),
		);
		expect(formatDate).toHaveBeenCalledTimes(days);

		expect(result.current.data).toEqual([
			{
				date: expectedDates[0],
				dayName: "X",
				high: Math.ceil(tMax[0]),
				low: Math.ceil(tMin[0]),
				conditionCode: weatherCodes[0],
			},
			{
				date: expectedDates[1],
				dayName: "X",
				high: Math.ceil(tMax[1]),
				low: Math.ceil(tMin[1]),
				conditionCode: weatherCodes[1],
			},
			{
				date: expectedDates[2],
				dayName: "X",
				high: Math.ceil(tMax[2]),
				low: Math.ceil(tMin[2]),
				conditionCode: weatherCodes[2],
			},
		]);

		expect(toast.error).not.toHaveBeenCalled();
	});

	it("shows a toast and returns empty array if daily() is missing", async () => {
		const pos = { coords: { latitude: 1, longitude: 2 } };
		const days = 2;

		const badResponse = {
			utcOffsetSeconds: () => 0,
			daily: () => null,
		};
		(getForecastWeather as unknown as Mock).mockResolvedValueOnce([
			badResponse,
		]);

		const { result } = renderHook(() => useForecastWeatherQuery(pos, days), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(toast.error).toHaveBeenCalledWith(
			"Error when fetching forecast weather",
		);
		expect(result.current.data).toEqual([]);
	});

	it("surfaces API errors when getForecastWeather rejects", async () => {
		const pos = { coords: { latitude: 10, longitude: 20 } };
		const err = new Error("network fail");
		(getForecastWeather as unknown as Mock).mockRejectedValueOnce(err);

		const { result } = renderHook(() => useForecastWeatherQuery(pos, 5), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect((result.current.error as Error).message).toBe("network fail");
	});
});
