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
import { useAppContext } from '@src/context';
export default function NewsOrderCard() {
	const limitResult = 6;
	const accessTokenAdmin = useAccessTokenAdmin();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user, socket } = useAppContext();
	const getData = async cancelTokenSource => {
		setLoading(true);
		try {
			const res = await api.get('/api/admin/product/product-sold?limit=' + limitResult, {
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
	// socket khi user mua hàng
	const socketOnPayment = newPayment => {
		// vì trong này chưa dùng tới id user nên chưa cần id user
		const newPaymentFormat = {
			// _id: newPayment._id,
			ShoppingHistory: {
				...newPayment,
				Time: new Date(),
			},
		};
		setData(prev => [newPaymentFormat, ...prev]);
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
	return (
		<Card>
			<CardHeader color="blue" contentPosition="none">
				<div className="w-full flex items-center justify-between">
					<h2 className="text-white text-2xl">Đơn hàng gần đây</h2>
					<Link href="/san-pham-da-ban">
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
											label: 'Tên người mua',
										},
										{
											label: 'Số điện thoại',
										},
										{
											label: 'Tổng tiền',
										},
										{
											label: 'Thời gian',
										},
										{
											label: 'Trạng thái',
										},
									].map((item, key) => (
										<th
											key={key}
											className="px-2 text-blue-500 align-middle border-b border-solid border-gray-200 py-3 whitespace-nowrap text-left">
											{item.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{item.ShoppingHistory.Name}
										</td>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{formatPhoneNumber(item.ShoppingHistory.PhoneNumber)}
										</td>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{formatCurency(item.ShoppingHistory.TotalMoney)}
										</td>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											{FormatDate(item.ShoppingHistory.Time)}
										</td>
										<td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
											<Label color="teal">
												{item.ShoppingHistory.Status}
											</Label>
										</td>
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
