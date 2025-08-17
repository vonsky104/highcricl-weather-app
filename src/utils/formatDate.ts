export function formatDate(date: Date): { dayName: string; date: string } {
	const today = new Date();
	const target = new Date(date);

	today.setHours(0, 0, 0, 0);
	target.setHours(0, 0, 0, 0);

	const diffDays = Math.floor(
		(target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	let dayName: string;
	if (diffDays === 0) {
		dayName = "Today";
	} else if (diffDays === 1) {
		dayName = "Tomorrow";
	} else {
		dayName = target.toLocaleDateString("en-US", { weekday: "long" });
	}

	const dateString = target.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});

	return { dayName, date: dateString };
}
