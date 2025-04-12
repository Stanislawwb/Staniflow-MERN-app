export const formatDate = (date: string) => {
	return new Date(date).toLocaleString("en-GB", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};
