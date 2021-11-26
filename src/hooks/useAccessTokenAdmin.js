import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { getCookie } from '@src/helper/helpCookie';
export default function useAccessTokenAdmin() {
	const [accessTokenAdmin, setAccessTokenAdmin] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const accessToken = getCookie('accessTokenAdmin');
		if (!accessToken || accessToken == '') {
			message.error('Bạn cần đăng nhập lại');
			return router.replace('/login');
		}
		setAccessTokenAdmin(accessToken);
	}, []);
	return accessTokenAdmin;
}
