import { formatUrlForImage } from '@src/helper/formatHelper';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { message, Modal, Typography, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineInfoCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
const uuid = require('react-uuid');
import api from '@src/config/api';
import showErrorHelper from '@src/helper/showErrorHelper';
import { managerProductActions } from '../managerProductSlice';
import { useProductContext } from '../managerProductContext';
import { serverApi } from '@src/config/constrant';
function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function beforeUpload(file, typeReturn) {
	// typeReturn
	// nếu là từ ImageCop , không ko đúng định dạng thì false
	// nếu là từ upload , không ko đúng định dạng thì Upload.LIST_IGNORE

	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('Chỉ hỗ trợ định dạng jpg, png');
		if (typeReturn === 'Upload') {
			return Upload.LIST_IGNORE;
		}
		return false;
	}
	const isLt2M = file.size / 1024 / 1024 < 3;
	if (!isLt2M) {
		message.error('DUng lượng ảnh không được vượt quá 3MB!');
		if (typeReturn === 'Upload') {
			return Upload.LIST_IGNORE;
		}
		return false;
	}
	return isJpgOrPng && isLt2M;
}
export default function AddListImage() {
	const { modalAddProduct, setModalAddProduct } = useProductContext();
	const { addListImage: listImage } = modalAddProduct;
	const [previewImageState, setPreViewImage] = useState({
		previewVisible: false,
		previewImage: '',
		previewTitle: '',
	});
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

	const handleChangeImage = ({ fileList }) => {
		console.log(fileList);
		setModalAddProduct(prev => ({
			...prev,
			addListImage: fileList,
		}));
	};

	return (
		<div className="mt-8 pt-8 border-t">
			<Typography.Title level={5}>Danh sách hình ảnh</Typography.Title>
			<ImgCrop
				aspect={1 / 1}
				quality={1}
				rotate={true}
				modalTitle="Chỉnh sửa ảnh"
				accept=".jpg,.png"
				beforeCrop={file => beforeUpload(file, 'ImgCrop')}
				onUploadFail={() => {
					message.error('Không thể upload ảnh');
				}}>
				<Upload
					action={serverApi}
					onPreview={handlePreviewImage}
					onChange={handleChangeImage}
					accept=".jpg,.png"
					size="large"
					fileList={listImage}
					beforeUpload={file => beforeUpload(file, 'Upload')}
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
