export default function formatPhoneNumber(string = "") {
	return string.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, "$1 $2 $3");
}
