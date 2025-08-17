import { getCities } from "@/api/getCities.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import useSearchCitiesQuery, { MIN_SEARCH_LENGTH } from "./";

vi.mock("@/api/getCities.ts", () => ({
	getCities: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	// @ts-expect-error fine for tests
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

beforeEach(() => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
	vi.clearAllMocks();
	vi.useRealTimers();
});

describe("useSearchCitiesQuery", () => {
	it("returns 'more chars required' and does not call API when search is undefined", async () => {
		const { result } = renderHook(() => useSearchCitiesQuery(undefined), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.data).toEqual({
				results: [],
				isMoreCharsRequired: true,
			});
		});

		expect(getCities).not.toHaveBeenCalled();
	});

	it(`returns 'more chars required' and does not call API when search length < ${MIN_SEARCH_LENGTH}`, async () => {
		const { result, rerender } = renderHook(
			({ q }) => useSearchCitiesQuery(q),
			{
				wrapper: createWrapper(),
				initialProps: { q: "ab" },
			},
		);

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual({
				results: [],
				isMoreCharsRequired: true,
			});
		});

		expect(getCities).not.toHaveBeenCalled();

		rerender({ q: "" });

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual({
				results: [],
				isMoreCharsRequired: true,
			});
		});

		expect(getCities).not.toHaveBeenCalled();
	});

	it("debounces input and fetches when length >= MIN_SEARCH_LENGTH", async () => {
		const mockResponse = {
			results: [{ id: 1, name: "Warsaw" }],
			isMoreCharsRequired: false,
		};

		(getCities as unknown as Mock).mockResolvedValueOnce(mockResponse);

		const { result } = renderHook(() => useSearchCitiesQuery("War"), {
			wrapper: createWrapper(),
		});

		expect(getCities).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(getCities).toHaveBeenCalledTimes(1);
		expect(getCities).toHaveBeenCalledWith("War");

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
			expect(result.current.data).toEqual(mockResponse);
		});
	});

	it("resets to 'more chars required' when the term becomes too short again", async () => {
		const mockResponse = {
			results: [{ id: 1, name: "Warsaw" }],
			isMoreCharsRequired: false,
		};
		(getCities as unknown as Mock).mockResolvedValueOnce(mockResponse);

		const { result, rerender } = renderHook(
			({ q }) => useSearchCitiesQuery(q),
			{ wrapper: createWrapper(), initialProps: { q: "Warsaw" } },
		);

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual(mockResponse);
		});
		expect(getCities).toHaveBeenCalledTimes(1);

		rerender({ q: "Wa" });

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual({
				results: [],
				isMoreCharsRequired: true,
			});
		});

		expect(getCities).toHaveBeenCalledTimes(1);
	});

	it("coalesces rapid changes into a single API call (debounce)", async () => {
		const mockResponse = {
			results: [{ id: 2, name: "Warsaw" }],
			isMoreCharsRequired: false,
		};
		(getCities as unknown as Mock).mockResolvedValueOnce(mockResponse);

		const { rerender, result } = renderHook(
			({ q }) => useSearchCitiesQuery(q),
			{ wrapper: createWrapper(), initialProps: { q: "War" } },
		);

		rerender({ q: "Wars" });
		rerender({ q: "Warsz" });

		expect(getCities).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(getCities).toHaveBeenCalledTimes(1);
		expect(getCities).toHaveBeenCalledWith("Warsz");

		await waitFor(() => {
			expect(result.current.data).toEqual(mockResponse);
		});
	});
});
