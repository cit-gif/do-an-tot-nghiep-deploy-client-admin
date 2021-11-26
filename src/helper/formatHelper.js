import { serverApi } from '@src/config/constrant';

export const formatUrlForImage = (url = '' || {}) => {
	if (typeof url === 'object') {
		return url;
	}
	if (url.startsWith('data:image')) return url;
	return `${serverApi}${url}`;
};
