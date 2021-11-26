import { formatUrlForImage } from '@src/helper/formatHelper';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { message, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineInfoCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
const uuid = require('react-uuid');
import api from '@src/config/api';
import showErrorHelper from '@src/helper/showErrorHelper';
import { managerProductActions } from '../managerProductSlice';
function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 3;
	if (!isLt2M) {
		message.error('DUng lượng ảnh không được vượt quá 3MB!');
	}
	return isJpgOrPng && isLt2M;
}
export default function EditListImage() {
	const accessTokenAdmin = useAccessTokenAdmin();
	const listImage = useSelector(state => state.managerProduct.modalEditProduct.data.Image);
	const idProduct = useSelector(state => state.managerProduct.modalEditProduct.data.Id_Product);
	const Id_GroupProduct = useSelector(state => state.managerProduct.modalEditProduct.data._id);
	const typeProduct = useSelector(state => state.managerProduct.modalEditProduct.data.ProductType);
	const dispatch = useDispatch();

	const handlePreviewImage = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreViewImage({
			...previewImageState,
			previewImage: file.url || file.preview,
			previewVisible: true,
			previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
		});
	};
	const handleAddImage = async file => {
		try {
			const dataSubmit = new FormData();
			dataSubmit.append('image', file);
			const res = await api.post('/api/admin/addImageProduct', dataSubmit, {
				headers: {
					authorization: accessTokenAdmin,
					idproduct: idProduct,
					idgroupproduct: Id_GroupProduct,
					typeproduct: typeProduct,
				},
			});

			// cập nhật trong data table và modal
			const newImageUrl = res.data.newImageUrl;
			dispatch(managerProductActions.updateOnAddImageForDataModal(newImageUrl));
			dispatch(
				managerProductActions.updateOnAddImageForDataTable({
					Id_Product: idProduct,
					urlImage: newImageUrl,
				})
			);
			message.success(res.data.message);
		} catch (error) {
			showErrorHelper(error);
		}
	};
	const handleChangeImage = uploadFile => {
		if (uploadFile.file.status === 'removed') {
			// cập nhật ảnh cho data modal khi xóa
			return dispatch(managerProductActions.updateOnDeleteImageForDataModal(uploadFile.file.name));
		} else {
			// thêm ảnh

			handleAddImage(uploadFile.file.originFileObj);
		}
	};

	// danh sách hình ảnh
	const listImageFormat = listImage.map((item, key) => ({
		uid: uuid(),
		name: item,
		status: 'done',
		url: formatUrlForImage(item),
	}));
	const [previewImageState, setPreViewImage] = useState({
		previewVisible: false,
		previewImage: '',
		previewTitle: '',
	});
	const handleDelete = async (urlImage, callback) => {
		// callback là trả về có xóa hay ko true/false
		try {
			const dataSubmit = {
				Id_GroupProduct: Id_GroupProduct,
				Id_Product: idProduct,
				urlImage: urlImage,
			};
			const res = await api.post('/api/admin/deleteOneImageProduct', dataSubmit, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
			});
			// set lại image cho data table còn data modal thì có trong handle change
			callback(true);
			dispatch(managerProductActions.updateOnDeleteImageForDataTable(dataSubmit));
			message.success(res.data.message);
		} catch (error) {
			callback(false);

			showErrorHelper(error);
		}
	};
	const handleShowConfirmDelete = async fileRemove => {
		//https://ant.design/components/upload/#API
		// trả về promise
		return new Promise((resolve, reject) => {
			Modal.confirm({
				title: 'Xác nhận xóa hình ảnh này',
				icon: <AiOutlineInfoCircle className="text-xl text-yellow-400" />,
				okText: 'Xác nhận',
				cancelText: 'Đóng',
				onCancel: () => reject(),
				onOk: () => {
					handleDelete(fileRemove.name, resolve);
				},
				okButtonProps: {
					danger: true,
				},
			});
		});
	};
	// - end
	return (
		<div className="mt-8 border-t">
			<ImgCrop
				aspect={1 / 1}
				quality={1}
				rotate={true}
				modalTitle="Chỉnh sửa ảnh"
				onUploadFail={() => {
					message.error('Không thể upload ảnh');
				}}>
				<Upload
					onPreview={handlePreviewImage}
					onChange={handleChangeImage}
					onRemove={handleShowConfirmDelete}
					size="large"
					fileList={listImageFormat}
					beforeUpload={beforeUpload}
					listType="picture-card">
					<div className="flex flex-col items-center justify-center">
						<AiOutlinePlus />
						<div className="mt-2">Thêm ảnh</div>
					</div>
				</Upload>
			</ImgCrop>
			<Modal
				visible={previewImageState.previewVisible}
				title={
					<span style={{ margin: '0 1rem', display: 'block' }}>
						{previewImageState.previewTitle}
					</span>
				}
				footer={null}
				onCancel={() =>
					setPreViewImage({
						...previewImageState,
						previewVisible: false,
					})
				}>
				<img
					alt={previewImageState.previewTitle}
					style={{ width: '100%' }}
					src={previewImageState.previewImage}
				/>
			</Modal>
		</div>
	);
}
