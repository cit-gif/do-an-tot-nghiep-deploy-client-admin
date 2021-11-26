import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import PaginationNotLink from '@src/components/common/Pagination/PaginationNotLink';
import ProgressLoading from '@src/components/common/ProgressLoading';
import api from '@src/config/api';
import formatCurency from '@src/helper/FormatCurency';
import FormatDate from '@src/helper/FormatDate';
import { formatUrlForImage } from '@src/helper/formatHelper';
import formatPhoneNumber from '@src/helper/formatPhoneNumber';
import { Button as ButtonAntd, Descriptions, message, Modal } from 'antd';
import axios from 'axios';
import cookieCutter from 'cookie-cutter';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TrJSX = props => {
	const { bg = '', data, setDataTable } = props;

	const [showModal, setShowModal] = useState(false);
	const handleToggleModal = () => {
		setShowModal(!showModal);
	};

	return (
		<tr className={`border-b border-gray-200 hover:bg-gray-100 ${bg}`}>
			<td className="py-3 px-6 text-left">
				<div className="flex items-center">
					<span>{data._id}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-left">
				<div className="flex items-center">
					<span>{data.Name}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{formatPhoneNumber(data.PhoneNumber)}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{FormatDate(data.Time)}</span>
				</div>
			</td>

			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{data.City}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{data.District}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{data.Wards}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{data.Details}</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{formatCurency(data.TotalMoney)}</span>
				</div>
			</td>

			<td className="py-3 px-6 text-center">
				<div className="flex item-center justify-center">
					<div
						onClick={e => {
							e.preventDefault();
							setShowModal(true);
						}}
						className="cursor-pointer mr-8 transform hover:text-purple-500 hover:scale-110 text-primary hover:underline">
						Xem chi tiết
					</div>

					<Modal
						title="Sản phẩm trong đơn hàng"
						visible={showModal}
						cancelText={null}
						okText="Đóng"
						onCancel={handleToggleModal}
						footer={[
							<ButtonAntd onClick={handleToggleModal} type="primary" key="close">
								Đóng
							</ButtonAntd>,
						]}
						// onOk={handleOk}
					>
						<div className="flex gap-2 text-xl mb-2">
							<span>Tổng tiền:</span>
							<span className="text-red-600 font-medium">
								{formatCurency(data.TotalMoney)}
							</span>
						</div>
						{data.Products.map((item, key) => {
							return (
								<Descriptions
									title={`Sản phẩm ${key + 1}`}
									key={key}
									bordered
									layout="horizontal"
									column={1}>
									<Descriptions.Item label="Hình ảnh ">
										<div className="relative w-20 h-24">
											<Image
												layout="fill"
												src={formatUrlForImage(item.DisplayImage)}
												alt={item.ProductName}
											/>
										</div>
									</Descriptions.Item>
									<Descriptions.Item label="Tên sản phẩm">
										{item.ProductName}
									</Descriptions.Item>
									<Descriptions.Item label="Thương hiệu">
										{item.BrandName}
									</Descriptions.Item>
									<Descriptions.Item label="Số lượng">
										{item.Amount}
									</Descriptions.Item>
									{item.PriceSale > 0 ? (
										<>
											<Descriptions.Item label="Giá khuyến mại">
												{formatCurency(item.PriceSale)}
											</Descriptions.Item>
											<Descriptions.Item label="Giá bán ra">
												<span className="line-through">
													{formatCurency(item.Price)}
												</span>
											</Descriptions.Item>
										</>
									) : (
										<Descriptions.Item label="Giá bán ra">
											{formatCurency(item.Price)}
										</Descriptions.Item>
									)}
									<Descriptions.Item label="Thành tiền">
										<span className="text-red-400">
											{formatCurency(
												item.Amount *
													(item.PriceSale > 0
														? item.PriceSale
														: item.Price)
											)}
										</span>
									</Descriptions.Item>
								</Descriptions>
							);
						})}
					</Modal>
				</div>
			</td>
		</tr>
	);
};
const limitResult = 15;
const formatDataFromResponse = (response = []) => {
	return response.map(item => {
		const { Address, ...data } = item.ShoppingHistory;

		return {
			...data,
			...Address,
		};
	});
};
const ManageUser = () => {
	const router = useRouter();
	const [showLoadingDataTable, setShowLoadingDataTable] = useState(false);
	const [dataTable, setDataTable] = useState({ data: [], metaData: [] });
	const [loading, setLoading] = useState(false);

	const getData = async cancelTokenSource => {
		setShowLoadingDataTable(true);

		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');

		if (!accessTokenAdmin || accessTokenAdmin == '') {
			return router.push('/login');
		}

		const query = router.query.query || '^';
		const page = router.query.page || 1;
		try {
			const res = await api.get(
				'/api/admin/product/product-sold?query=' + query + '&page=' + page + '&limit=' + limitResult,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },

					cancelToken: cancelTokenSource.token,
				}
			);
			setDataTable(() => {
				return {
					...res.data[0],
					data: formatDataFromResponse(res.data[0].data || []),
				};
			});
			setLoading(true);
		} catch (error) {
			message.error('Đã có lỗi');
		}
		setShowLoadingDataTable(false);
	};
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getData(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, []);
	const [inputValue, setInputValue] = useState(router.query.query || '');
	const handleSearch = async e => {
		e.preventDefault();
		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');

		if (!accessTokenAdmin || accessTokenAdmin == '') {
			return router.push('/login');
		}
		setShowLoadingDataTable(true);
		const page = 1;
		try {
			const res = await api.get(
				'/api/admin/product/product-sold?query=' +
					inputValue.trim() +
					'&page=' +
					page +
					'&limit=' +
					limitResult,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				}
			);
			router.push(
				router.pathname,
				{
					query: {
						query: inputValue.trim(),
						page: page,
					},
				},
				{ shallow: true }
			);
			setDataTable(() => {
				return {
					...res.data[0],
					data: formatDataFromResponse(res.data[0].data || []),
				};
			});
			setShowLoadingDataTable(false);
		} catch (error) {
			setShowLoadingDataTable(false);
		}
	};
	// const getUrl = (() => {
	//       const urlSearchParams = new URLSearchParams(window.location.search);
	//       const query = Object.fromEntries(urlSearchParams.entries());

	// });
	const handlerPagination = async page => {
		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');

		if (!accessTokenAdmin || accessTokenAdmin == '') {
			return router.push('/login');
		}
		setShowLoadingDataTable(true);

		try {
			const res = await api.get(
				'/api/admin/product/product-sold?query=' +
					inputValue.trim() +
					'&page=' +
					page +
					'&limit=' +
					limitResult,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				}
			);
			setDataTable(() => {
				return {
					...res.data[0],
					data: formatDataFromResponse(res.data[0].data || []),
				};
			});
			setShowLoadingDataTable(false);
		} catch (error) {
			setShowLoadingDataTable(false);
		}
	};

	return (
		<div>
			<div className="overflow-x-auto">
				<form
					onSubmit={handleSearch}
					className="flex flex-wrap items-center justify-end space-y-2 max-w-[15rem] mx-auto mt-8 mb-12">
					<Input
						onChange={e => {
							setInputValue(e.target.value);
						}}
						value={inputValue}
						type="text"
						color="cyan"
						size="regular"
						outline={true}
						placeholder="Tìm kiếm người dùng"
					/>
					<Button
						type="submit"
						color="cyan"
						buttonType="filled"
						size="regular"
						rounded={false}
						block={false}
						iconOnly={false}
						ripple="light">
						Tìm kiếm
					</Button>
				</form>
				{/* loading */}
				<ProgressLoading show={showLoadingDataTable} />

				{/* --- */}
				<div className="flex items-center justify-between px-2 md:px-12">
					<div className="text-gray-900 text-sm font-medium">
						{(() => {
							if (loading) {
								if (dataTable.data.length === 0) {
									return 'Không có người dùng nào';
								}
								return (
									<span>
										Trang: {dataTable.metaData[0].page} từ{' '}
										{dataTable.metaData[0].skip + 1} -{' '}
										{dataTable.metaData[0].skip + dataTable.data.length} trên{' '}
										{dataTable.metaData[0].total}
									</span>
								);
							}
							return null;
						})()}
					</div>
					{/* {(() => {
						if (dataTable.data.length === 0) {
							return null;
						}
						const newDataFormat = dataTable.data.map(data => {
							return {
								'ID Người dùng': data._id,
								Tên: data.Name,
								'Số điện thoại': data.PhoneNumber,
								'Địa chỉ': `Tỉnh/Thành phố: ${data.Address.City} - Quận/huyện: ${data.Address.District} - Xã/Thị trấn: ${data.Address.Wards} - Chi tiết: ${data.Address.Details}`,
								'Ngày tạo tài khoản': FormatDate(data.createdAt),
							};
						});

						return <ExportExcel csvData={newDataFormat} fileName="Quan_Li_nguoi_dung" />;
					})()} */}
				</div>
				<div className="min-w-screen min-h-screen bg-gray-100 flex items-center  font-sans overflow-auto">
					<div className="w-full lg:w-5/6 mx-auto">
						<div className="bg-white min-w-max shadow-md rounded my-6">
							<table id="table" className="min-w-max w-full table-auto">
								<thead>
									<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
										{[
											{ title: 'Mã đơn hàng' },
											{ title: 'Tên người mua' },
											{ title: 'Số điện thoại' },
											{ title: 'Thời gian' },

											{ title: 'Tỉnh/Thành phố' },
											{ title: 'Quận/Huyện' },
											{ title: 'Xã/Phường' },
											{ title: 'Địa chỉ chi tiết' },
											{ title: 'Tổng tiền' },

											{ title: 'Xem sản phẩm đã mua' },
										].map((item, key) => {
											return (
												<th key={key} className="py-3 px-6 text-left">
													{item.title}
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody className="text-gray-600 text-sm font-medium">
									{dataTable?.data?.map((item, key) => {
										if (key % 2 === 0) {
											return (
												<TrJSX
													data={item}
													key={key}
													setDataTable={setDataTable}
												/>
											);
										}
										return (
											<TrJSX
												data={item}
												key={key}
												bg="bg-gray-50"
												setDataTable={setDataTable}
											/>
										);
									})}
									{/* {dataTable.data.map((item, key) => {
                                                            return 
                                                      })} */}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{loading && (
				<div className="my-8">
					<PaginationNotLink
						// url={}
						className="justify-center"
						totalCount={dataTable.metaData.length !== 0 ? dataTable.metaData[0].total : 0}
						currentPage={dataTable.metaData.length !== 0 ? dataTable.metaData[0].page : 1}
						pageSize={
							dataTable.metaData.length !== 0 ? dataTable.metaData[0].limit : limitResult
						}
						handler={handlerPagination}
					/>
				</div>
			)}
		</div>
	);
};

export default ManageUser;
