import { configureStore } from '@reduxjs/toolkit';
import managerProductReducer from '@src/components/managerProduct/managerProductSlice';
export const store = configureStore({
	reducer: {
		managerProduct: managerProductReducer,
	},
});
