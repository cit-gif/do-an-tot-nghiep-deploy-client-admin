import api from '@src/config/api';
import { useAppContext } from '@src/context';
import customRequestAntd from '@src/helper/customRequestAntd';
import { formatUrlForImage } from '@src/helper/formatHelper';
import { getCookie } from '@src/helper/helpCookie';
import { Avatar, Button, Card, message, Space, Upload } from 'antd';
import React, { useState } from 'react';
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
export default function EditNameAndAvatar() {
	const { user, setUser } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [fileAvatart, setFileAvatar] = useState(null);
	const [disabledButtonSave, setDisabledButtonSave] = useState(true);
	const handleChange = info => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, imageUrl => {
				setLoading(false);
				setUser({ ...user, Avatar: imageUrl });
				setDisabledButtonSave(false);
				setFileAvatar(info.file.originFileObj);
			});
		}
	};
	const handleSave = async () => {
		if (!fileAvatart) return message.error('Chưa chọn file');
		try {
			const accessTokenAdmin = getCookie('accessTokenAdmin');

			const dataForm = new FormData();
			dataForm.append('image', fileAvatart);
			const res = await api.post('/api/admin/uploadAvatarAdmin', dataForm, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
			});
			setUser({ ...user, Avatar: res.data.url });
			setFileAvatar(null);
			setDisabledButtonSave(true);
			message.success('Đổi Avatar thành công');
		} catch (error) {
			console.log(error);
			if (error?.response?.data?.message) {
				return message.error(error?.response.data?.message);
			}
			message.error(typeof error.message == 'string' ? error.message : 'Đã có lỗi');
		}
	};
	return (
		<Card>
			<Space size="large">
				<Avatar size={64} src={formatUrlForImage(user.Avatar)} />
				<Upload
					customRequest={customRequestAntd}
					accept=".jpg,.png"
					multiple={false}
					name="image"
					showUploadList={false}
					beforeUpload={beforeUpload}
					onChange={handleChange}>
					<Button type="primary">Thay đổi hình đại diện</Button>
				</Upload>
				{!disabledButtonSave && (
					<Button onClick={handleSave} type="primary" disabled={disabledButtonSave}>
						Lưu
					</Button>
				)}
			</Space>
		</Card>
	);
}
