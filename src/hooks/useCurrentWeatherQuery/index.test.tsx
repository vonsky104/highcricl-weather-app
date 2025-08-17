import { getCurrentWeather } from "@/api/weather.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import useCurrentWeatherQuery from "./";

vi.mock("@/api/weather.ts", () => ({
	getCurrentWeather: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: { error: vi.fn() },
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	// @ts-expect-error simplified for tests
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

// Mocked weather response
const makeWeatherResponse = ({
	utcOffsetSeconds,
	code,
	temp,
	wind,
	humidity,
}: {
	utcOffsetSeconds: number;
	code: number;
	temp: number;
	wind: number;
	humidity: number;
}) => {
	const currentObj = {
		time: () => 0,
		variables: (i: number) => ({
			value: () => [code, temp, wind, humidity][i],
		}),
	};

	return {
		utcOffsetSeconds: () => utcOffsetSeconds,
		current: () => currentObj,
	};
};

describe("useCurrentWeatherQuery", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("does not fetch when currentPosition is null", async () => {
		const { result } = renderHook(() => useCurrentWeatherQuery(null), {
			wrapper: createWrapper(),
		});

		expect(getCurrentWeather).not.toHaveBeenCalled();

		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetching).toBe(false);
	});

	it("fetches and maps weather data correctly", async () => {
		const utcOffsetSeconds = 7200; // 2h offset;
		const code = 0;
		const temp = 21.5;
		const wind = 7.2;
		const humidity = 63;

		const response = makeWeatherResponse({
			utcOffsetSeconds,
			code,
			temp,
			wind,
			humidity,
		});

		(getCurrentWeather as unknown as Mock).mockResolvedValueOnce([response]);

		const pos = {
			coords: { latitude: 52.2297, longitude: 21.0122 },
		};

		const { result } = renderHook(() => useCurrentWeatherQuery(pos), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(getCurrentWeather).toHaveBeenCalledWith(
			pos.coords.latitude,
			pos.coords.longitude,
		);

		const expectedDate = new Date(utcOffsetSeconds * 1000);

		expect(result.current.data).toEqual({
			time: expectedDate,
			weatherCode: code,
			temperature: temp,
			windSpeed: wind,
			humidity,
		});
		expect(toast.error).not.toHaveBeenCalled();
	});

	it("shows a toast and returns null if current is missing", async () => {
		const badResponse = {
			utcOffsetSeconds: () => 0,
			current: () => null,
		};

		(getCurrentWeather as unknown as Mock).mockResolvedValueOnce([badResponse]);

		const pos = {
			coords: { latitude: 1, longitude: 2 },
		};

		const { result } = renderHook(() => useCurrentWeatherQuery(pos), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(toast.error).toHaveBeenCalledWith(
			"Error when fetching current weather",
		);
		expect(result.current.data).toBeNull();
	});

	it("surfaces API errors via react-query", async () => {
		const err = new Error("network down");
		(getCurrentWeather as unknown as Mock).mockRejectedValueOnce(err);

		const pos = {
			coords: { latitude: 10, longitude: 20 },
		};

		const { result } = renderHook(() => useCurrentWeatherQuery(pos), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(getCurrentWeather).toHaveBeenCalledWith(10, 20);
		expect((result.current.error as Error).message).toBe("network down");
	});
});
