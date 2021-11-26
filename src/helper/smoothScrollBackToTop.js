function easeInOutCubic(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t * t + b;
	t -= 2;
	return (c / 2) * (t * t * t + 2) + b;
}
function smoothScrollBackToTop({ targe = window, position = 0, times = 500 }) {
	let targetPosition = position;
	let startPosition = targe === window ? targe.pageYOffset : targe.scrollTop;
	let distance = targetPosition - startPosition;
	let duration = times;
	let start = null;
	window.requestAnimationFrame(step);
	function step(timestamp) {
		if (!start) start = timestamp;
		let progress = timestamp - start;
		targe.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
		if (progress < duration) window.requestAnimationFrame(step);
	}
}
export default smoothScrollBackToTop;
