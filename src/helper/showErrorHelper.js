import { message } from 'antd';
export default function showErrorHelper(error) {
	const errorMessage = error?.response?.data?.message;
	if (errorMessage) {
		return message.error(errorMessage);
	}
	if (typeof error.message === 'string') {
		return message.error(error.message);
	}
	message.error('Đã có lỗi');
}
