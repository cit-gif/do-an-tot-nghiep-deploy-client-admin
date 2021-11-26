import Image from 'next/image';
import api from '@src/config/api';
import { limitFindUser } from '@src/config/constrant';
import { AppContext } from '@src/context';
import { useContext, useEffect } from 'react';
import Input from '@material-tailwind/react/Input';
import Button from '@material-tailwind/react/Button';
import cookieCutter from 'cookie-cutter';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useRef } from 'react';
import formatPhoneNumber from '@src/helper/formatPhoneNumber';
import FormatDate from '@src/helper/FormatDate';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Tooltips from '@material-tailwind/react/Tooltips';
import TooltipsContent from '@material-tailwind/react/TooltipsContent';
import ModalEditUser from '@src/components/managerUser/ModalEditUser';
import ModalDeleteUser from '@src/components/managerUser/ModalDeleteUser';
import PaginationNotLink from '@src/components/common/Pagination/PaginationNotLink';
import { serverApi, qualityImage } from '@src/config/constrant';
import { ExportExcel } from '@src/components/common/ExportToExcel';
import ProgressLoading from '@src/components/common/ProgressLoading';
// import { Modal as ModalAntd, Button as ButtonAntd } from 'antd';
const TrJSX = props => {
	const { bg = '', data, setDataTable } = props;

	const editRef = useRef();
	const deleteRef = useRef();
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [showModalDelete, setShowModalDelete] = useState(false);
	// const [modalShowProductPurchased, setModalShowProductPurchased] = useState(false);
	return (
		<tr className={`border-b border-gray-200 hover:bg-gray-100 ${bg}`}>
			<td className="py-3 px-6 text-left whitespace-nowrap">
				<div className="flex items-center">
					<div className="relative flex items-center justify-center rounded-full shadow overflow-hidden bg-primary w-12 h-12">
						<span className="text-white">{data.Name.trim().split(' ').pop()}</span>
						{data.Avatar !== '' && (
							<Image
								src={serverApi + data.Avatar}
								layout="fill"
								objectFit="cover"
								quality={qualityImage}
							/>
						)}
					</div>
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

			{/* <td className="py-3 px-6 text-center">
				<span className="bg-green-200 text-green-900 py-1 px-3 rounded-full text-xs font-medium">
					Active
				</span>
			</td> */}
			<td className="py-3 px-6 text-center">
				<div className="flex items-center">
					<span>{FormatDate(data.createdAt)}</span>
				</div>
			</td>
			<td className="py-3 px-6 ">
				<div className="flex items-center max-w-[10rem] overflow-x-auto">
					<span>
						{data.Address.City === '' ? (
							'-'
						) : (
							<>
								TP/T: {data.Address.City} <br />
								Q/H: {data.Address.District} <br />
								X/P: {data.Address.Wards} <br />
								CT: {data.Address.Details}
							</>
						)}
					</span>
				</div>
			</td>
			<td className="py-3 px-6 text-center">
				<div className="flex item-center justify-center text-xl gap-8">
					<div
						ref={editRef}
						onClick={e => {
							e.preventDefault();
							setShowModalEdit(true);
						}}
						className="cursor-pointer w-4 mr-8 transform hover:text-purple-500 hover:scale-110">
						<Pencil />
					</div>

					<Tooltips placement="top" ref={editRef}>
						<TooltipsContent>Sửa</TooltipsContent>
					</Tooltips>
					<ModalEditUser
						showModal={showModalEdit}
						data={data}
						setShowModal={setShowModalEdit}
						setDataTable={setDataTable}
					/>
					{/* '--------------------' */}
					<div
						onClick={e => {
							e.preventDefault();
							setShowModalDelete(true);
						}}
						ref={deleteRef}
						className="cursor-pointer w-4 text-red-800 transform  hover:scale-110">
						<Trash />
					</div>
					<Tooltips placement="top" ref={deleteRef}>
						<TooltipsContent>Xóa</TooltipsContent>
					</Tooltips>
					<ModalDeleteUser
						setDataTable={setDataTable}
						data={data}
						showModal={showModalDelete}
						setShowModal={setShowModalDelete}
					/>
					{/* <a
						onClick={e => {
							e.preventDefault();
							setModalShowProductPurchased(true);
						}}
						className="text-base text-primaryDark cursor-pointer hover:underline ">
						Xem đơn hàng đã mua
					</a>
					<ModalAntd
						visible={modalShowProductPurchased}
						title="Sản phẩm đã mua"
						onCancel={() => {
							setModalShowProductPurchased(false);
						}}
						footer={[
							<ButtonAntd
								onClick={() => {
									setModalShowProductPurchased(false);
								}}
								key="close">
								Đóng
							</ButtonAntd>,
                                    ]}>
                                    
                                    </ModalAntd> */}
				</div>
			</td>
		</tr>
	);
};
const ManageUser = () => {
	const { user, setUser } = useContext(AppContext);
	const router = useRouter();
	const [showLoadingDataTable, setShowLoadingDataTable] = useState(false);
	const [dataTable, setDataTable] = useState({ data: [], metaData: [] });
	const [loading, setLoading] = useState(false);

	const getUsers = async cancelTokenSource => {
		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');

		if (!accessTokenAdmin || accessTokenAdmin == '') {
			return router.push('/login');
		}

		const query = router.query.query || '^';
		const page = router.query.page || 1;
		try {
			const res = await api.get(
				'/api/admin/getusers?query=' + query + '&page=' + page + '&limit=' + limitFindUser,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },

					cancelToken: cancelTokenSource.token,
				}
			);
			setDataTable(res.data[0]);
			setLoading(true);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getUsers(cancelTokenSource);
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
				'/api/admin/getusers?query=' + inputValue.trim() + '&page=' + page + '&limit=' + limitFindUser,
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
			setDataTable(res.data[0]);
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
				'/api/admin/getusers?query=' + inputValue.trim() + '&page=' + page + '&limit=' + limitFindUser,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				}
			);
			setDataTable(res.data[0]);
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
										{dataTable.metaData[0].countUsers}
									</span>
								);
							}
							return null;
						})()}
					</div>
					{(() => {
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
					})()}
				</div>
				<div className="min-w-screen min-h-screen bg-gray-100 flex items-center  font-sans overflow-auto">
					<div className="w-full lg:w-5/6 mx-auto">
						<div className="bg-white min-w-max shadow-md rounded my-6">
							<table id="table" className="min-w-max w-full table-auto">
								<thead>
									<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
										<th className="py-3 px-6 text-left">Ảnh đại diện</th>
										<th className="py-3 px-6 text-left">Tên người dùng</th>
										<th className="py-3 px-6 text-center">Số điện thoại</th>
										{/* <th className="py-3 px-6 text-center">Trạng thái</th> */}
										<th className="py-3 px-6 text-center">Ngày tạo</th>
										<th className="py-3 px-6 text-center">Địa chỉ</th>
										<th className="py-3 px-6 text-center">Hành động</th>
									</tr>
								</thead>
								<tbody className="text-gray-600 text-sm font-medium">
									{dataTable.data.map((item, key) => {
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
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{loading && (
				<div className="my-8">
					<PaginationNotLink
						className="justify-center"
						totalCount={dataTable.metaData.length !== 0 ? dataTable.metaData[0].countUsers : 0}
						currentPage={dataTable.metaData.length !== 0 ? dataTable.metaData[0].page : 1}
						pageSize={
							dataTable.metaData.length !== 0 ? dataTable.metaData[0].limit : limitFindUser
						}
						handler={handlerPagination}
					/>
				</div>
			)}
		</div>
	);
};

export default ManageUser;
