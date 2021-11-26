import { useAppContext } from '@src/context';
import { Card, Input, Modal, Button, Typography, Space, message } from 'antd';
import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import api from '@src/config/api';
import { getCookie } from '@src/helper/helpCookie';

export default function EditNameAdmin() {
	const { user, setUser } = useAppContext();

	const [visibleModal, setVisibleModal] = useState(false);
	const [valueInput, setValueInput] = useState(user.DisplayName);
	const handleCancelModal = () => {
		setVisibleModal(false);
	};
	const handleOpenModal = () => {
		setVisibleModal(true);
	};
	const handleSubmitaChangeName = async () => {
		try {
			const accessTokenAdmin = getCookie('accessTokenAdmin');

			if (valueInput.trim() == '') return message.error('Tên không hợp lệ');
			const res = await api.post(
				'/api/admin/edit-name-admin',
				{ DisplayName: valueInput },
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin || '' },
				}
			);
			setUser({ ...user, DisplayName: res.data.DisplayName });
			setVisibleModal(false);
			message.success('Đổi tên thành công');
		} catch (error) {
			if (error?.response?.data?.message) {
				return message.error(error?.response?.data?.message);
			}
			return message.error('Đã xảy ra lỗi');
		}
	};
	return (
		<Card>
			<Space>
				<Typography.Text>{user.DisplayName}</Typography.Text>
				<Button type="link" onClick={handleOpenModal} icon={<AiOutlineEdit />}></Button>
				<Modal
					visible={visibleModal}
					onCancel={handleCancelModal}
					onOk={handleSubmitaChangeName}
					cancelText="Hủy bỏ"
					okText="Lưu thay đổi"
					title="Thay đổi tên">
					<Input
						value={valueInput}
						onChange={e => {
							setValueInput(e.target.value);
						}}
						type="text"
						defaultValue={user.DisplayName}
					/>
				</Modal>
			</Space>
		</Card>
	);
}
