import { Button, Card, Input, message, Space, Typography } from 'antd';
import { useState } from 'react';
import React from 'react';
import { getCookie } from '@src/helper/helpCookie';
import api from '@src/config/api';

export default function EditPassword() {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const isButtonDisabled = loading || oldPassword === '' || newPassword === '';
	const handleSubmit = async e => {
		try {
			e.preventDefault();
			setLoading(true);
			const accessTokenAdmin = getCookie('accessTokenAdmin') || '';

			await api.post(
				'/api/admin/edit-password',
				{ oldPassword, newPassword },
				{
					headers: {
						authorization: accessTokenAdmin,
					},
				}
			);
			setLoading(false);

			message.success('Đổi mật khẩu thành công');
		} catch (error) {
			setLoading(false);

			if (error?.response?.data?.message) {
				return message.error(error.response.data.message);
			}
			message.error('Đã có lỗi');
		}
	};
	return (
		<Card>
			<form onSubmit={handleSubmit}>
				<Space direction="vertical" size="middle">
					<Typography.Title level={4}>Đổi mật khẩu</Typography.Title>
					<Space direction="vertical" size="large">
						<Input.Password
							minLength={8}
							value={oldPassword}
							onChange={e => {
								setOldPassword(e.target.value);
							}}
							placeholder="Mật khẩu cũ"
						/>
						<Input.Password
							minLength={8}
							value={newPassword}
							onChange={e => {
								setNewPassword(e.target.value);
							}}
							placeholder="Mật khẩu mới"
						/>
					</Space>
					<Button loading={loading} htmlType="submit" disabled={isButtonDisabled} type="primary">
						Lưu mật khẩu
					</Button>
				</Space>
			</form>
		</Card>
	);
}
