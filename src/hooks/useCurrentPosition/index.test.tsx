import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useCurrentPosition from "./";

vi.mock("sonner", () => {
	return {
		toast: {
			error: vi.fn(),
		},
	};
});

type GeoSuccess = Parameters<Geolocation["getCurrentPosition"]>[0];
type GeoError = Parameters<Geolocation["getCurrentPosition"]>[1];

const mockGeolocation = (impl?: {
	success?: (cb: GeoSuccess) => void;
	error?: (cb: GeoError) => void;
}) => {
	const getCurrentPosition = vi.fn((success: GeoSuccess, error?: GeoError) => {
		setTimeout(() => {
			if (impl?.success) impl.success(success);
			else if (impl?.error && error) impl.error(error);
		}, 0);
	});

	Object.defineProperty(globalThis.navigator, "geolocation", {
		value: { getCurrentPosition },
		configurable: true,
	});

	return { getCurrentPosition };
};

const removeGeolocation = () => {
	Object.defineProperty(globalThis.navigator, "geolocation", {
		value: undefined,
		configurable: true,
	});
};

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("useCurrentPosition", () => {
	beforeEach(() => {
		removeGeolocation();
	});

	it("shows a toast error when geolocation is not supported and returns null", () => {
		const { result } = renderHook(() => useCurrentPosition());
		const error = "Geolocation is not supported in your browser.";

		expect(toast.error).toHaveBeenCalledWith(error);
		expect(result.current).toStrictEqual({
			currentPosition: null,
			geolocationError: error,
		});
	});

	it("sets current position on success", async () => {
		const fakePosition = {
			coords: {
				latitude: 40.7128,
				longitude: -74.006,
				accuracy: 5,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		} as GeolocationPosition;

		const { getCurrentPosition } = mockGeolocation({
			success: (cb) => cb(fakePosition),
		});

		const { result } = renderHook(() => useCurrentPosition());

		expect(getCurrentPosition).toHaveBeenCalledTimes(1);

		await waitFor(() => {
			expect(result.current).toEqual({
				currentPosition: fakePosition,
				geolocationError: null,
			});
		});

		expect(toast.error).not.toHaveBeenCalled();
	});

	it("shows a toast error when geolocation fails and returns null", async () => {
		const error = "User denied Geolocation";
		mockGeolocation({
			error: (cb) =>
				cb?.({
					code: 1,
					message: error,
					PERMISSION_DENIED: 1,
					POSITION_UNAVAILABLE: 2,
					TIMEOUT: 3,
				}),
		});

		const { result } = renderHook(() => useCurrentPosition());

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(error);
		});

		expect(result.current).toStrictEqual({
			currentPosition: null,
			geolocationError: error,
		});
	});
});
