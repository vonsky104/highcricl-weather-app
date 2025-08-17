import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
	const fixedNow = new Date("2025-08-17T10:00:00Z");

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fixedNow);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns 'Today' when given today's date", () => {
		const d = new Date("2025-08-17T15:00:00Z"); // same day, different time
		const result = formatDate(d);

		expect(result).toEqual({
			dayName: "Today",
			date: "August 17",
		});
	});

	it("returns 'Tomorrow' when given tomorrow's date", () => {
		const d = new Date("2025-08-18T08:00:00Z");
		const result = formatDate(d);

		expect(result).toEqual({
			dayName: "Tomorrow",
			date: "August 18",
		});
	});

	it("returns weekday name for a date 2 days in the future", () => {
		const d = new Date("2025-08-19T12:00:00Z");
		const result = formatDate(d);

		expect(result).toEqual({
			dayName: "Tuesday",
			date: "August 19",
		});
	});
});
