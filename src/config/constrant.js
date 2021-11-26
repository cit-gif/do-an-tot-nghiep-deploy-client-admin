const serverApi = process.env.NEXT_PUBLIC_SERVER_API || '';

const hostApi = process.env.NEXT_PUBLIC_HOST || '';
const clientDomain = process.env.NEXT_PUBLIC_CLIENT_DOMAIN || '';
const qualityImage = 100;
const limitFindUser = 20;
const limitFindGroupProduct = 10;

module.exports = {
	serverApi,
	hostApi,
	qualityImage,
	limitFindUser,
	limitFindGroupProduct,
	clientDomain,
};
