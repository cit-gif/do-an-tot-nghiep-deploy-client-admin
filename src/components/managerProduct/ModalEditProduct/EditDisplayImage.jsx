import api from '@src/config/api';
import { serverApi } from '@src/config/constrant';
import customRequestAntd from '@src/helper/customRequestAntd';
import { formatUrlForImage } from '@src/helper/formatHelper';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { Button, Card, message, Space, Upload } from 'antd';
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
export default function EditDisplayImage() {
	const { Id_Product, ProductType, DisplayImage } = useSelector(getDataEditImage);
	// const Id_Product = useSelector(state => state.managerProduct.modalEditProduct.data.Id_Product);
	// const ProductType = useSelector(state => state.managerProduct.modalEditProduct.data.ProductType);
	// const DisplayImage = useSelector(state => state.managerProduct.modalEditProduct.data.Information.DisplayImage);
	const [loadingBtn, setLoadingBtn] = useState(false);
	const { modalEditProduct, setModalEditUrlDisplayImage, setModalEditFileDisplayImage } = useProductContext();
	const { file: fileAvatart, url: urlFile } = modalEditProduct.editDisplayImage;
	const dispatch = useDispatch();
	const handleChange = info => {
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj, imageUrl => {
				setModalEditUrlDisplayImage(imageUrl);
				setModalEditFileDisplayImage(info.file.originFileObj);
			});
		}
	};
	const accessTokenAdmin = useAccessTokenAdmin();
	const handleSave = async () => {
		if (!fileAvatart) return message.error('Chưa chọn file');
		try {
			setLoadingBtn(true);
			const dataForm = new FormData();
			dataForm.append('image', fileAvatart);

			const res = await api.post('/api/admin/editDisplayImageProduct', dataForm, {
				headers: {
					'Content-Type': 'application/json',
					authorization: accessTokenAdmin,
					typeproduct: ProductType,
					_id: Id_Product,
				},
			});

			//set lại image ch hình ảnh sản phẩm
			dispatch(
				managerProductActions.updateDisplayImageForOneProduct({
					Id_Product: Id_Product,
					newImageUrl: res.data.newImageUrl,
				})
			);
			//set lại url cho data modal
			dispatch(managerProductActions.setDisplayImageForData(res.data.newImageUrl));
			// set null cho state
			setModalEditUrlDisplayImage(null);
			setModalEditFileDisplayImage(null);
			message.success(res.data.message);
		} catch (error) {
			console.log(error?.response);
			if (error?.response?.data?.message) {
				return message.error(error?.response.data?.message);
			}
			message.error(typeof error.message == 'string' ? error.message : 'Đã có lỗi');
		}
		setLoadingBtn(false);
	};
	return (
		<Card title="Hình ảnh hiển thị">
			<Space size="large">
				<div className="relative w-20 h-20 mx-auto">
					{DisplayImage && (
						<Image
							src={formatUrlForImage(urlFile ? urlFile : DisplayImage)}
							layout="fill"
							objectFit="cover"
						/>
					)}
				</div>
				<Upload
					customRequest={customRequestAntd}
					accept=".jpg,.png"
					multiple={false}
					name="image"
					showUploadList={false}
					beforeUpload={beforeUpload}
					onChange={handleChange}>
					<Button type="primary">Thay đổi hình ảnh hiển thị</Button>
				</Upload>
				{fileAvatart && (
					<Button loading={loadingBtn} onClick={handleSave} type="primary">
						Lưu
					</Button>
				)}
			</Space>
		</Card>
	);
}
