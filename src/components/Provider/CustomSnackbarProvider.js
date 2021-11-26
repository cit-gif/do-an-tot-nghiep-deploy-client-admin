import { SnackbarProvider } from "notistack";
import Slide from "@material-ui/core/Slide";
import { CheckCircleFill } from "react-bootstrap-icons";
// https://iamhosseindhv.com/notistack/demos#custom-variants
function CustomSnackbarProvider(props) {
	return (
		<SnackbarProvider
			// iconVariant={{
			// 	// success: (
			// 	// 	<div className='mr-2'>
			// 	// 		<CheckCircleFill />
			// 	// 	</div>
			// 	// ),
			// 	// error: "✖️",
			// 	// warning: "⚠️",
			// 	// info: "ℹ️",
			// }}
			classes={{
				variantSuccess: "bg-green-600 mb-2",
				variantError: "mb-2",
				variantWarning: "mb-2",
				variantInfo: "mb-2",
			}}
			hideIconVariant={false} // cho phép hiển thị icon
			maxSnack={3}
			autoHideDuration={5000}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}
			// action={
			// 	<button
			// 		className='bg-black cursor-pointer z-[1000]'
			// 		onClick={(e) => {
			// 			console.log("adsadsa", e);
			// 		}}
			// 	>
			// 		Alert
			// 	</button>
			// }
			// content={(key, message) => (
			// 	<div
			// 		className='bg-green-600 '
			// 		onClick={() => {
			// 			console.log(1);
			// 		}}
			// 		id={key}
			// 	>
			// 		{message}
			// 	</div>
			// )}
			TransitionComponent={Slide}
		>
			{props.children}
		</SnackbarProvider>
	);
}

export default CustomSnackbarProvider;
