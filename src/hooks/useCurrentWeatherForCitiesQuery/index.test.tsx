import { getCurrentWeatherForMultipleLocations } from "@/api/weather.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import useCurrentWeatherForCitiesQuery from "./";

vi.mock("@/api/weather.ts", () => ({
	getCurrentWeatherForMultipleLocations: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	// @ts-expect-error simplified typing for tests
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

const makeCurrentLocationWeatherFetched = (code: number, temp: number) => ({
	current: () => ({
		variables: (i: number) => ({
			value: () => [code, temp][i],
		}),
	}),
});

const makeCurrentLocationWeatherNotFetched = () => ({
	current: () => null,
});

describe("useCurrentWeatherForCitiesQuery", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("does not run when either array is empty", () => {
		const { result } = renderHook(
			() => useCurrentWeatherForCitiesQuery([], [52.2]),
			{ wrapper: createWrapper() },
		);
		expect(getCurrentWeatherForMultipleLocations).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetching).toBe(false);

		const { result: result2 } = renderHook(
			() => useCurrentWeatherForCitiesQuery([21.0], []),
			{ wrapper: createWrapper() },
		);
		expect(getCurrentWeatherForMultipleLocations).not.toHaveBeenCalled();
		expect(result2.current.data).toBeUndefined();
		expect(result2.current.isFetching).toBe(false);
	});

	it("fetches and maps multiple locations correctly", async () => {
		const longitudes = [21.0122, 19.9445];
		const latitudes = [52.2297, 50.0647];

		(
			getCurrentWeatherForMultipleLocations as unknown as Mock
		).mockResolvedValueOnce([
			makeCurrentLocationWeatherFetched(80, 21.5), // Warsaw
			makeCurrentLocationWeatherFetched(61, 18.3), // Kraków
		]);

		const { result } = renderHook(
			() => useCurrentWeatherForCitiesQuery(longitudes, latitudes),
			{ wrapper: createWrapper() },
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(getCurrentWeatherForMultipleLocations).toHaveBeenCalledWith(
			latitudes,
			longitudes,
		);

		expect(result.current.data).toEqual([
			{ weatherCode: 80, temperature: 21.5, isFetched: true },
			{ weatherCode: 61, temperature: 18.3, isFetched: true },
		]);
	});

	it("marks a location as not fetched and logs an error when current() is missing", async () => {
		const longitudes = [21.0122, 19.9445, 18.6466];
		const latitudes = [52.2297, 50.0647, 54.352];

		(
			getCurrentWeatherForMultipleLocations as unknown as Mock
		).mockResolvedValueOnce([
			makeCurrentLocationWeatherFetched(80, 21.5),
			makeCurrentLocationWeatherNotFetched(), // missing current() for index 1
			makeCurrentLocationWeatherFetched(3, -1.2),
		]);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const { result } = renderHook(
			() => useCurrentWeatherForCitiesQuery(longitudes, latitudes),
			{ wrapper: createWrapper() },
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual([
			{ weatherCode: 80, temperature: 21.5, isFetched: true },
			{ isFetched: false },
			{ weatherCode: 3, temperature: -1.2, isFetched: true },
		]);

		expect(errorSpy).toHaveBeenCalledWith(
			`Not fetched weather for location: ${longitudes[1]}:${latitudes[1]}`,
		);

		errorSpy.mockRestore();
	});

	it("surfaces API errors via react-query", async () => {
		const longitudes = [21];
		const latitudes = [52];
		const err = new Error("network down");
		(
			getCurrentWeatherForMultipleLocations as unknown as Mock
		).mockRejectedValueOnce(err);

		const { result } = renderHook(
			() => useCurrentWeatherForCitiesQuery(longitudes, latitudes),
			{ wrapper: createWrapper() },
		);

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect((result.current.error as Error).message).toBe("network down");
	});
});
