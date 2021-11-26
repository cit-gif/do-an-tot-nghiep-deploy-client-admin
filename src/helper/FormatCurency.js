export default function formatCurency(number = 0) {
	return number.toLocaleString("vi", { style: "currency", currency: "VND" });
}
