import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

const ProductContextProvider = props => {
	const [modalEditProduct, setModalEditProduct] = useState({
		editDisplayImage: {
			file: null, // file khi chọn thay đổiimage
			url: null,
		},
	});
	const setModalEditUrlDisplayImage = url => {
		setModalEditProduct(prev => ({
			...prev,
			editDisplayImage: {
				...prev.editDisplayImage,
				url: url,
			},
		}));
	};

	const setModalEditFileDisplayImage = file => {
		setModalEditProduct(prev => ({
			...prev,
			editDisplayImage: {
				...prev.editDisplayImage,
				file,
			},
		}));
	};
	// thêm sản phẩm
	const [modalAddProduct, setModalAddProduct] = useState({
		addDisplayImage: {
			url: null,
			file: null,
		},
		addInformations: {
			ProductName: '',
			GroupProduct: '',
			Price: 0,
			PriceSale: 0,
			RemainingAmount: 0,
		},
		addConfiguration: [],
		addListImage: [],
	});
	const setAddUrlDisplayImage = url => {
		setModalAddProduct(prev => ({
			...prev,
			addDisplayImage: {
				...prev.addDisplayImage,
				url: url,
			},
		}));
	};

	const setAddFileDisplayImage = file => {
		setModalAddProduct(prev => ({
			...prev,
			addDisplayImage: {
				...prev.addDisplayImage,
				file,
			},
		}));
	};
	return (
		<ProductContext.Provider
			value={{
				modalEditProduct,
				setModalEditUrlDisplayImage,
				setModalEditFileDisplayImage,
				modalAddProduct,
				setAddUrlDisplayImage,
				setAddFileDisplayImage,
				setModalAddProduct,
			}}>
			{props.children}
		</ProductContext.Provider>
	);
};
export const useProductContext = () => useContext(ProductContext);
export { ProductContextProvider, ProductContext };
