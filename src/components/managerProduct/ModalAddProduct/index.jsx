import { Modal, message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { managerProductActions } from '../managerProductSlice';
import AddConfiguration from './AddConfiguration';
import AddDisplayImage from './AddDisplayImage';
import AddInformation from './AddInformation';
import AddListImage from './AddListImage';
import { useProductContext } from '../managerProductContext';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import showErrorHelper from '@src/helper/showErrorHelper';
import api from '@src/config/api';
export default function ModalAddProduct() {
	const showModal = useSelector(state => state.managerProduct.modalAddProduct.show);

	const dispatch = useDispatch();
	const accessTokenAdmin = useAccessTokenAdmin();
	const { modalAddProduct, setModalAddProduct } = useProductContext();
	const { url, file } = modalAddProduct.addDisplayImage;
	const { ProductName, GroupProduct, Price, PriceSale, RemainingAmount } = modalAddProduct.addInformations;
	const addConfiguration = modalAddProduct.addConfiguration;
	const addListImage = modalAddProduct.addListImage;

	const handleCancelModal = async () => {
		dispatch(managerProductActions.setShowModalAdd(false));
	};
	const handleSubmit = async () => {
		try {
			if (url == null || file == null) return message.error('Hình ảnh hiển thị không được để trống');
			if (ProductName.trim().length < 3)
				return message.error('Tên sản phẩm phải lớn lơn hoặc bằng 3 kí tự');
			if (GroupProduct === '') return message.error('Chưa chọn nhóm sản phẩm');
			if (Price < 0) return message.error('Giá sản phẩm phải lớn hơn hoặc bằng 0 ');
			if (PriceSale < 0) return message.error('Giá khuyến mại sản phẩm phải lớn hơn hoặc bằng 0 ');
			if (RemainingAmount < 0) return message.error('Số lượng sản phẩm không được bé hơn 0');
			const dataSubmit = new FormData();
			dataSubmit.append('DisplayImage', file);
			dataSubmit.append('ProductName', ProductName);
			dataSubmit.append('GroupProduct', GroupProduct);
			dataSubmit.append('Price', Price);
			dataSubmit.append('PriceSale', PriceSale);
			dataSubmit.append('RemainingAmount', RemainingAmount);
			dataSubmit.append('Configuration', JSON.stringify(addConfiguration));
			// danh sách hình ảnh hiển thị là một array file
			// ko thể gửi ` dataSubmit.append('Image', listImage);
			// mà phải lọc append nhiều lần
			const listImage = addListImage.map(item => item.originFileObj);
			listImage.forEach(fileUpload => {
				dataSubmit.append('Image', fileUpload);
			});
			const res = await api.post('/api/admin/addProduct', dataSubmit, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: accessTokenAdmin,
					idgroupproduct: GroupProduct,
					productname: encodeURIComponent(ProductName),
				},
			});
			// ste lại mặt định modal add

			setModalAddProduct(prev => ({
				...prev,
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
			}));
			// cập nhật vào dataTable
			dispatch(managerProductActions.onAddProductDataTable(res.data));
			message.success('Thêm sản phẩm thành công');
		} catch (error) {
			showErrorHelper(error);
		}
	};
	return (
		<Modal
			width={1000}
			title="Thêm sản phẩm mới"
			onCancel={handleCancelModal}
			okText="Thêm"
			onOk={handleSubmit}
			cancelText="Hủy bỏ"
			visible={showModal}>
			{/* Thêm hình ảnh hiển thị */}
			<AddDisplayImage />
			{/*  thêm thông tin sản phẩm */}
			<AddInformation />
			{/* Thêm cấu hình cho sản phẩm */}
			<AddConfiguration />
			{/* thêm danh sách hình ảnh */}
			<AddListImage />
		</Modal>
	);
}
