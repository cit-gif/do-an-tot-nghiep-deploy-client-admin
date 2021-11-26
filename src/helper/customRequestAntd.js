export default function customRequestAntd({ file, onSuccess }) {
	setTimeout(() => {
		onSuccess('ok');
	}, 0);
}
