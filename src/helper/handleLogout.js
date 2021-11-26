import { setCookie } from './helpCookie';
export default function handleLogout() {
	if (typeof window !== 'undefined') {
		setCookie('accessTokenAdmin', '', '/');
		window.location.href = '/';
	}
}
