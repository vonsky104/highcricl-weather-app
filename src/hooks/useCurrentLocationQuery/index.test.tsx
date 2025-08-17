import { getCurrentLocation } from "@/api/getCurrentLocation.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import useCurrentLocationQuery from "./";

vi.mock("@/api/getCurrentLocation.ts", () => {
	return {
		getCurrentLocation: vi.fn(),
	};
});

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	// @ts-expect-error children typing is fine for tests
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

afterEach(() => {
	vi.clearAllMocks();
	cleanup();
});

describe("useCurrentLocationQuery", () => {
	it("does not call getCurrentLocation when currentPosition is null (disabled query)", async () => {
		const { result } = renderHook(() => useCurrentLocationQuery(null), {
			wrapper: createWrapper(),
		});

		expect(getCurrentLocation).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetching).toBe(false);
		expect(result.current.isSuccess).toBe(false);
	});

	it("calls getCurrentLocation with latitude/longitude and returns data", async () => {
		const fakePosition = {
			coords: {
				latitude: 52.2297,
				longitude: 21.0122,
			},
		} as const;

		const mockResponse = { city: "Warsaw", country: "PL" };
		(getCurrentLocation as unknown as Mock).mockResolvedValueOnce(mockResponse);

		const { result } = renderHook(() => useCurrentLocationQuery(fakePosition), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(getCurrentLocation).toHaveBeenCalledTimes(1);
		expect(getCurrentLocation).toHaveBeenCalledWith(
			fakePosition.coords.latitude,
			fakePosition.coords.longitude,
		);

		expect(result.current.data).toEqual(mockResponse);
	});

	it("propagates errors from getCurrentLocation", async () => {
		const fakePosition = {
			coords: {
				latitude: 1,
				longitude: 2,
			},
		} as const;

		const mockError = new Error("Network fail");
		(getCurrentLocation as unknown as Mock).mockRejectedValueOnce(mockError);

		const { result } = renderHook(() => useCurrentLocationQuery(fakePosition), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBe(mockError);
	});
});
