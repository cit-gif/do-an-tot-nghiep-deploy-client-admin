import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Progress from '@material-tailwind/react/Progress';
import api from '@src/config/api';
import { useEffect, useState } from 'react';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import showErrorHelper from '@src/helper/showErrorHelper';
import Link from 'next/link';
import axios from 'axios';
import formatPhoneNumber from '@src/helper/formatPhoneNumber';
import { Spin } from 'antd';
import formatCurency from '@src/helper/FormatCurency';
import Label from '@material-tailwind/react/Label';
import FormatDate from '@src/helper/FormatDate';
import { useSnackbar } from 'notistack';
import { useAppContext } from '@src/context';

export default function NewsOrderCard() {
	const limitResult = 6;
	const accessTokenAdmin = useAccessTokenAdmin();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user, socket } = useAppContext();
	const { enqueueSnackbar } = useSnackbar();
	const getData = async cancelTokenSource => {
		setLoading(true);
		try {
			const res = await api.get('/api/admin/getusers?limit=' + limitResult, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },

				cancelToken: cancelTokenSource.token,
			});

			setData(res.data[0]?.data);
		} catch (error) {
			showErrorHelper(error);
		}
		setLoading(false);
	};
	useEffect(() => {
		if (accessTokenAdmin == '' || !accessTokenAdmin) return;
		const cancelTokenSource = axios.CancelToken.source();
		getData(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, [accessTokenAdmin]);
	// khi 1 người dung mới đăng kí
	// socket on
	const socketOnNewUserCreate = newUser => {
		enqueueSnackbar(`${newUser.Name} vừa tạo tài khoản`, {
			variant: 'success',
		});
		setData(prev => [newUser, ...prev]);
	};

	useEffect(() => {
		if (socket && user) {
			socket.on('user:create', socketOnNewUserCreate);
		}
		return () => {
			if (socket) {
				socket.off('user:create', socketOnNewUserCreate);
			}
		};
	}, [socket]);
	return (
		<Card>
			<CardHeader color="cyan" contentPosition="none">
				<div className="w-full flex items-center justify-between">
					<h2 className="text-white text-2xl">Khách hàng mới</h2>
					<Link href="/manager-users">
						<a>Xem thêm</a>
					</Link>
				</div>
			</CardHeader>
			<CardBody>
				<div className="overflow-x-auto">
					<Spin spinning={loading}>
						<table className="items-center w-full bg-transparent border-collapse">
							<thead>
								<tr>
									{[
										{
											label: 'Tên',
										},
										{
											label: 'Số điện thoại',
										},
										{
											label: 'Ngày tạo',
										},
									].map((item, key) => (
										<th
											key={key}
											className="px-2 text-cyan-500 align-middle border-b border-solid border-gray-200 py-3 whitespace-nowrap text-left">
											{item.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{item.Name}
										</th>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{formatPhoneNumber(item.PhoneNumber)}
										</td>

										<th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{FormatDate(item.createdAt)}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</Spin>
				</div>
			</CardBody>
		</Card>
	);
}
