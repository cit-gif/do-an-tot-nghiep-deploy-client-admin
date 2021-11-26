import {
	Calendar3Event,
	Box,
	Messenger,
	ReceiptCutoff,
	LayoutTextWindow,
	PersonLinesFill,
	FileEarmarkRichtext,
} from 'react-bootstrap-icons';
import { useState, useContext, useEffect } from 'react';
import cookieCutter from 'cookie-cutter';
import { AppContext } from '@src/context';
import api from '@src/config/api';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Sidebar from '@src/components/Sidebar';
import { useSnackbar } from 'notistack';
import { CgProfile } from 'react-icons/cg';
import { MdProductionQuantityLimits } from 'react-icons/md';
function Layout(props) {
	const { children } = props;
	const { enqueueSnackbar } = useSnackbar();
	const slideTags = [
		{
			name: 'Tổng quang',
			icon: <ReceiptCutoff />,
			href: '/',
		},
		{
			name: 'Bình luận sản phẩm',
			icon: <ReceiptCutoff />,
			href: '/binh-luan',
		},
		{
			name: 'Tư vấn',
			icon: <Messenger />,
			href: '/message',
		},
		{
			name: 'Sản phẩm đã bán',
			icon: <MdProductionQuantityLimits />,
			href: '/san-pham-da-ban',
		},
		{
			name: 'Quản lí người dùng',
			icon: <PersonLinesFill />,
			href: '/manager-users',
		},
		{
			name: 'Quản lí thương hiệu',
			icon: <Calendar3Event />,
			href: '/manager-brands',
		},
		{
			name: 'Quản lí nhóm sản phẩm',
			icon: <LayoutTextWindow />,
			href: '/manager-groupsproduct',
		},
		{
			name: 'Quản lí sản phẩm',
			icon: <Box />,
			href: '/manager-products',
		},

		{
			name: 'Quản lí bài viết',
			icon: <FileEarmarkRichtext />,
			href: '/quan-li-bai-viet',
		},
		{
			name: 'Trang cá nhân',
			icon: <CgProfile />,
			href: '/trang-ca-nhan',
		},
	];

	const router = useRouter();
	const { user, setUser, setSocket, socket } = useContext(AppContext);

	// useEffect(() => {
	// 	const getLogin = async () => {
	// 		if (user) return;

	// 		const accessToken = cookieCutter.get('accessTokenAdmin');
	// 		if (!accessToken || accessToken == '') return router.push('/login');
	// 		try {
	// 			const res = await api.post('/api/admin', { accessToken });
	// 			setUser(res.data);
	// 			const newSocket = io('http://localhost:3000/chat', {
	// 				path: '/socket.io',
	// 				auth: {
	// 					accessToken: accessToken,
	// 				},
	// 			});
	// 			setSocket(newSocket);
	// 		} catch (error) {
	// 			if (error.response) {
	// 				if (error.response.status === 400) {
	// 					router.push('/login');
	// 				}
	// 			}
	// 		}
	// 	};
	// 	getLogin();
	// 	return () => {
	// 		if (socket) socket.disconnect();
	// 	};
	// }, []);
	const socketOnPayment = newPayment => {
		enqueueSnackbar(newPayment.Name + ' đã mua hàng /n Tổng tiền: ' + newPayment.TotalMoney, {
			variant: 'success',
		});
	};

	useEffect(() => {
		if (socket && user) {
			socket.on('userPayment', socketOnPayment);
		}
		return () => {
			if (socket) {
				socket.off('userPayment', socketOnPayment);
			}
		};
	}, [socket]);

	const getTagActive = () => {
		return slideTags.findIndex(tag => tag.href === router.pathname);
	};
	const [stateTag, setTag] = useState(getTagActive());
	if (!user) {
		return '';
	}
	return (
		<div className="h-full flex flex-col justify-between">
			<Sidebar tags={slideTags} tagActiviti={stateTag} setTagActiviti={setTag} />
			<div className="md:ml-72 flex-auto overflow-auto">
				{children}
				{/* <Footer /> */}
			</div>
		</div>
	);
}

export default Layout;
