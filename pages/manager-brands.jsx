import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import { useEffect, useState, useRef } from "react";
import ProgressLoading from "@src/components/common/ProgressLoading";
import FormatDate from "@src/helper/FormatDate";
import api from "@src/config/api";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import axios from "axios";
import { Pencil, Trash, PlusCircle } from "react-bootstrap-icons";
import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";
import ModalDeleteBrand from "@src/components/managerBrands/ModalDeleteBrand";
import ModalAddBrand from "@src/components/managerBrands/ModalAddBrand";
import ModalEditBrand from "@src/components/managerBrands/ModalEditBrand";
import Button from "@material-tailwind/react/Button";
function ManagerBrands() {
	const [showLoading, setShowLoading] = useState(false);
	const [data, setData] = useState([
		{
			_id: 1,
			BrandImage: 1,
			BrandName: 1,
			createdAt: 1,
		},
	]);
	const router = useRouter();
	const getBrands = async (cancelTokenSource) => {
		setShowLoading(true);
		const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
		if (!accessTokenAdmin || accessTokenAdmin == "") {
			return router.push("/login");
		}
		try {
			const res = await api.get("/api/admin/getbrands", {
				headers: { "Content-Type": "application/json", authorization: accessTokenAdmin },
				cancelToken: cancelTokenSource.token,
			});

			setData(res.data);
		} catch (error) {
			// console.log(error.message);
		}
		setShowLoading(false);
	};
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getBrands(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, []);
	const editRef = useRef(null);
	const deleteRef = useRef(null);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const [showModalAdd, setShowModalAdd] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [deleteSelected, setDeleteSelected] = useState({});
	// set State từ props
	const [editSelected, setEditSelected] = useState({
		BrandImage: "",
		BrandName: "",
		_id: "",
	});
	// - end
	return (
		<div className='container mx-auto px-4 sm:px-8 max-w-3xl'>
			<div className='w-full mt-8'>
				<Button onClick={() => setShowModalAdd(true)} className='mx-auto' color='cyan' buttonType='filled' size='regular' rounded={false} block={false} iconOnly={false} ripple='light'>
					<span className='text-2xl font-semibold'>
						<PlusCircle />
					</span>
					<span>Thêm thương hiệu mới</span>
				</Button>
				<ModalAddBrand showModal={showModalAdd} setShowModal={setShowModalAdd} setDataTable={setData} />
			</div>
			<ProgressLoading show={showLoading} />
			<div className='py-8'>
				<div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
					<div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
						<table className='min-w-full leading-normal'>
							<thead>
								<tr>
									{["Hình ảnh", "Tên thương hiệu", "Ngày tạo", "Hành động"].map((x, key) => (
										<th key={key} scope='col' className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm font-semibold'>
											{x}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((x, key) => (
									<tr key={key}>
										<td className='px-5 py-5 border-b border-gray-200 bg-transparent text-sm'>
											<div className='w-32 h-8 relative overflow-hidden rounded-full border'>
												<Image src={`${serverApi}${x.BrandImage}`} title={x.BrandName} alt={x.BrandName} quality={qualityImage} layout='fill' objectFit='fill' />
											</div>
										</td>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<p className='text-gray-900 whitespace-no-wrap'>{x.BrandName}</p>
										</td>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<p className='text-gray-900 whitespace-no-wrap'>{FormatDate(x.createdAt)}</p>
										</td>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<div className='flex item-center justify-center text-xl'>
												<div
													ref={editRef}
													onClick={(e) => {
														e.preventDefault();
														setEditSelected(x);
														setShowModalEdit(true);
													}}
													className='cursor-pointer w-4 mr-8 transform hover:text-purple-500 hover:scale-110'
												>
													<Pencil />
												</div>

												<Tooltips placement='top' ref={editRef}>
													<TooltipsContent>Sửa</TooltipsContent>
												</Tooltips>
												{/* '--------------------' */}
												<div
													onClick={(e) => {
														e.preventDefault();
														setDeleteSelected(x);
														setShowModalDelete(true);
													}}
													ref={deleteRef}
													className='cursor-pointer w-4 text-red-800 transform  hover:scale-110'
												>
													<Trash />
												</div>
												<Tooltips placement='top' ref={deleteRef}>
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
				<ModalEditBrand showModal={showModalEdit} data={editSelected} setShowModal={setShowModalEdit} setDataTable={setData} />

				<ModalDeleteBrand setDataTable={setData} data={deleteSelected} showModal={showModalDelete} setShowModal={setShowModalDelete} />
			</div>
		</div>
	);
}

export default ManagerBrands;
