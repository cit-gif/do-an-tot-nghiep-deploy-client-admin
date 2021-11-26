export default {
	fullScreen: function (e) {
		const element = this.quill.container.parentElement;
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.webkitRequestFullscreen) {
			/* Safari */
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			/* IE11 */
			element.msRequestFullscreen();
		}
	},
	exitFullScreen: function () {
		if (document.fullscreenElement) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				/* Safari */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				/* IE11 */
				document.msExitFullscreen();
			}
		}
	},
};
