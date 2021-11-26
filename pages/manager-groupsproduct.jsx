import Image from 'next/image';
import { serverApi, qualityImage } from '@src/config/constrant';
import { useEffect, useState, useRef } from 'react';
import ProgressLoading from '@src/components/common/ProgressLoading';
import FormatDate from '@src/helper/FormatDate';
import api from '@src/config/api';
import { useRouter } from 'next/router';
import cookieCutter from 'cookie-cutter';
import axios from 'axios';
import { Pencil, Trash, PlusCircle } from 'react-bootstrap-icons';
import Tooltips from '@material-tailwind/react/Tooltips';
import TooltipsContent from '@material-tailwind/react/TooltipsContent';
import ModalDeleteGroupProduct from '@src/components/mangerGroupProduct/ModalDeleteGroupProduct';
import ModalAddGroupProduct from '@src/components/mangerGroupProduct/ModalAddGroupProduct';
import ModalEditGroupProduct from '@src/components/mangerGroupProduct/ModalEditGroupProduct';
import Button from '@material-tailwind/react/Button';
import PaginationNotLink from '@src/components/common/Pagination/PaginationNotLink';
import classNames from 'classnames';
import { limitFindGroupProduct } from '@src/config/constrant';
import { useSnackbar } from 'notistack';

function ManagerGroupsProduct() {
	const { enqueueSnackbar } = useSnackbar();
	const [showLoading, setShowLoading] = useState(false);
	const [data, setData] = useState([]);
	const [metaData, setMetaData] = useState(null);
	const router = useRouter();
	const [pageState, setPageState] = useState(-1);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		if (pageState !== -1) {
			getGroupsProduct(cancelTokenSource, pageState);
		}
		return () => {
			cancelTokenSource.cancel();
		};
	}, [pageState]);
	useEffect(() => {
		const page = router.query.page || 1;
		setPageState(page);
	}, []);
	const getGroupsProduct = async (cancelTokenSource, page) => {
		setShowLoading(true);
		const accessTokenAdmin = cookieCutter.get('accessTokenAdmin');
		if (!accessTokenAdmin || accessTokenAdmin == '') {
			return router.push('/login');
		}
		try {
			const res = await api.get(`/api/admin/getGroupProduct?limit=${limitFindGroupProduct}&page=${page}`, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				cancelToken: cancelTokenSource.token,
			});
			setData(res.data.data);

			setMetaData(res.data.metaData[0]);
		} catch (error) {
			enqueueSnackbar('Đã xảy ra lỗi tại quản lí nhóm sản phẩm');
			console.log(error.response?.data);
		}
		setShowLoading(false);
	};

	const editRef = useRef(null);
	const deleteRef = useRef(null);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const [showModalAdd, setShowModalAdd] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [deleteSelected, setDeleteSelected] = useState({});
	// set State từ props
	const [editSelected, setEditSelected] = useState({
		_id: '',
		GroupName: '',
		ProductType: '',
		BrandName: '',
		createdAt: '',
		CountProduct: '',
		Id_Brand: '',
	});
	// - end
	return (
		<div className="container mx-auto px-4 sm:px-8 max-w-7xl">
			<div className="w-full mt-8">
				<Button
					onClick={() => setShowModalAdd(true)}
					className="mx-auto"
					color="cyan"
					buttonType="filled"
					size="regular"
					rounded={false}
					block={false}
					iconOnly={false}
					ripple="light">
					<span className="text-2xl font-semibold">
						<PlusCircle />
					</span>
					<span>Thêm nhóm sản phẩm mới</span>
				</Button>
				<ModalAddGroupProduct
					showModal={showModalAdd}
					setShowModal={setShowModalAdd}
					setDataTable={setData}
				/>
			</div>
			<ProgressLoading show={showLoading} />
			<div className="py-8">
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
					<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
						<table className="min-w-max leading-normal  w-full">
							<thead>
								<tr>
									{[
										'Tên nhóm sản phẩm',
										'Loại sản phẩm',
										'Thương hiệu sản phẩm',
										'Ngày tạo',
										'Số sản phẩm trong nhóm',
										'Hành động',
									].map((x, key) => (
										<th
											key={key}
											scope="col"
											className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm font-semibold">
											{x}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((x, key) => (
									<tr
										key={key}
										className={classNames({
											'bg-white': key % 2 === 0,
											'bg-gray-100': key % 2 === 1,
										})}>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											{x.GroupName}
										</td>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{x.ProductType}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{x.BrandName}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{FormatDate(x.createdAt)}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{x.CountProduct}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 text-sm">
											<div className="flex item-center justify-center text-xl">
												<div
													ref={editRef}
													onClick={e => {
														e.preventDefault();
														setEditSelected(x);
														setShowModalEdit(true);
													}}
													className="cursor-pointer w-4 mr-8 transform hover:text-purple-500 hover:scale-110">
													<Pencil />
												</div>

												<Tooltips placement="top" ref={editRef}>
													<TooltipsContent>Sửa</TooltipsContent>
												</Tooltips>
												{/* '--------------------' */}
												<div
													onClick={e => {
														e.preventDefault();
														setDeleteSelected(x);
														setShowModalDelete(true);
													}}
													ref={deleteRef}
													className="cursor-pointer w-4 text-red-800 transform  hover:scale-110">
													<Trash />
												</div>
												<Tooltips placement="top" ref={deleteRef}>
													<TooltipsContent>Xóa</TooltipsContent>
												</Tooltips>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<ModalEditGroupProduct
					showModal={showModalEdit}
					data={editSelected}
					setShowModal={setShowModalEdit}
					setDataTable={setData}
				/>

				<ModalDeleteGroupProduct
					setDataTable={setData}
					data={deleteSelected}
					showModal={showModalDelete}
					setShowModal={setShowModalDelete}
				/>
			</div>
			{metaData && (
				<PaginationNotLink
					totalCount={metaData.total}
					currentPage={metaData.page}
					pageSize={metaData.limit}
					handler={async page => {
						setPageState(page);
					}}
				/>
			)}
		</div>
	);
}

export default ManagerGroupsProduct;
