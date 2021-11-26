import '../styles/tailwind.css';
import '../styles/globals.css';
// ES6
import CustomSnackbarProvider from '@src/components/Provider/CustomSnackbarProvider';
import { ContextProvider } from '@src/context';
import Layout from '@src/layout';
// import 'antd/dist/antd.css';
// require('../src/assets/antd-custom.less');
import { store } from '@src/store';
import { Provider } from 'react-redux';
function MyApp({ Component, pageProps }) {
	if (Component.getLayout) {
		//Layout for login
		return <Component {...pageProps} />;
	}
	return (
		<ContextProvider>
			<Provider store={store}>
				<CustomSnackbarProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</CustomSnackbarProvider>
			</Provider>
		</ContextProvider>
	);
}

export default MyApp;
