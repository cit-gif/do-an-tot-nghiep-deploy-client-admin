import api from '@src/config/api';
import { serverApi } from '@src/config/constrant';
import { formatUrlForImage } from '@src/helper/formatHelper';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { Button, Card, message, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProductContext } from '../managerProductContext';
import { getDataEditImage, getDataModalEdit, managerProductActions } from '../managerProductSlice';

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
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
export default function AddDisplayImage() {
	const { setAddUrlDisplayImage, setAddFileDisplayImage, modalAddProduct } = useProductContext();
	const { url: urlFile } = modalAddProduct.addDisplayImage;
	const handleChange = info => {
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj, imageUrl => {
				setAddUrlDisplayImage(imageUrl);
				setAddFileDisplayImage(info.file.originFileObj);
			});
		}
	};

	return (
		<Card title="Hình ảnh hiển thị">
			<Space size="large">
				<div className="relative w-32 h-32 mx-auto">
					{urlFile && (
						<img className="h-full w-full object-cover" src={formatUrlForImage(urlFile)} />
					)}
				</div>
				<ImgCrop
					aspect={1 / 1}
					quality={1}
					rotate={true}
					modalTitle="Chỉnh sửa ảnh"
					onUploadFail={() => {
						message.error('Không thể upload ảnh');
					}}>
					<Upload
						customRequest={({ onSuccess }) => {
							onSuccess('oke');
						}}
						accept=".jpg,.png"
						multiple={false}
						name="image"
						showUploadList={false}
						beforeUpload={beforeUpload}
						onChange={handleChange}>
						<Button type="primary">Chọn hình ảnh hiển thị</Button>
					</Upload>
				</ImgCrop>
			</Space>
		</Card>
	);
}
