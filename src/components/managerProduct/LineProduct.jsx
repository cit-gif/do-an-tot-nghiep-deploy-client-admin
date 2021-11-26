import { useRef, useState } from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Image from 'next/image';
import { serverApi, qualityImage } from '@src/config/constrant';
import FormatDate from '@src/helper/FormatDate';
import formatCurency from '@src/helper/FormatCurency';
import classNames from 'classnames';
import { Tooltip, message } from 'antd';
import { useDispatch } from 'react-redux';
import { managerProductActions } from './managerProductSlice';
import api from '@src/config/api';
import { Popconfirm } from 'antd';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import showErrorHelper from '@src/helper/showErrorHelper';
function LineProduct(props) {
	const { bg = '', data, setDataTable, index, setStateModalDetailProduct } = props;
	const editRef = useRef();
	const dispatch = useDispatch();
	const accessTokenAdmin = useAccessTokenAdmin();
	const handleDelete = async ({ Id_GroupProduct, Id_Product }) => {
		try {
			const res = await api.post(
				'/api/admin/deleteProduct',
				{ Id_GroupProduct, Id_Product },
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: accessTokenAdmin,
					},
				}
			);
			dispatch(managerProductActions.onDeleteOneProductOfDataTable(Id_Product));
			message.success(res.data.message);
		} catch (error) {
			showErrorHelper(error);
		}
	};
	return (
		<>
			{data.map((item, key) => (
				<tr
					key={key}
					className={classNames('border-b border-gray-200 ', { 'bg-gray-50': index % 2 === 0 })}>
					<td className="py-3 px-6 ">
						<div>
							<Image
								width={100}
								height={100}
								src={`${serverApi}${item.Information.DisplayImage}`}
								objectFit="cover"
								quality={qualityImage}
								loading="lazy"
							/>
						</div>
					</td>
					<td className="py-3 px-6 ">
						<Tooltip placement="top" title="Xem chi tiết sản phẩm">
							<span
								className="text-primaryDark hover:underline cursor-pointer"
								onClick={() => {
									setStateModalDetailProduct(pre => ({
										...pre,
										show: true,
										data: item,
									}));
								}}>
								{item.ProductName}
							</span>
						</Tooltip>
					</td>
					{key === 0 && (
						<td className="py-3 px-6 text-left" rowSpan={data.length}>
							<span>{item.GroupName}</span>
						</td>
					)}
					<td className="py-3 px-6 text-center">
						<span>{FormatDate(item.createdAt)}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<div className="flex items-center">
							<span>{item.ProductSold}</span>
						</div>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{formatCurency(item.Information.Price)}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{formatCurency(item.Information.PriceSale)}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{item.Information.RemainingAmount}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{item.Views}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{item?.Star?.toFixed(2) || 0}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{item.CountEvaluate}</span>
					</td>
					<td className="py-3 px-6 text-center">
						<span>{item.CountComment}</span>
					</td>

					<td className="py-3 px-6 text-center">
						<div className="flex item-center justify-center text-xl">
							<div
								ref={editRef}
								onClick={e => {
									e.preventDefault();

									// set data cho modal chỉnh sửa
									dispatch(managerProductActions.setDataModalEditProduct(item));
									dispatch(managerProductActions.showModalEditProduct());
									// setShowModalEdit(true);
								}}
								className="cursor-pointer w-4 mr-8 transform hover:text-purple-500 hover:scale-110">
								<Pencil />
							</div>
							{/* <Tooltips placement="top" ref={editRef}>
                                          <TooltipsContent>Sửa</TooltipsContent>
                                    </Tooltips> */}
							{/* <ModalEditUser showModal={showModalEdit} data={data} setShowModal={setShowModalEdit} setDataTable={setDataTable} /> */}
							{/* '--------------------' */}
							<Popconfirm
								title="Bạn có muốn xóa"
								okText="Xác nhận"
								cancelText="Hủy bỏ"
								onConfirm={() => {
									handleDelete({
										Id_GroupProduct: item._id,
										Id_Product: item.Id_Product,
									});
								}}
								okButtonProps={{ danger: true }}>
								<Trash className="cursor-pointer w-4 text-red-800 transform  hover:scale-110" />
							</Popconfirm>
							{/* <Tooltips placement="top" ref={deleteRef}>
                                          <TooltipsContent>Xóa</TooltipsContent>
                                    </Tooltips> */}
							{/* <ModalDeleteUser setDataTable={setDataTable} data={data} showModal={showModalDelete} setShowModal={setShowModalDelete} /> */}
						</div>
					</td>
				</tr>
			))}
			{/* <tr className="bg-primary">
				<td colSpan={Object.keys(data[0]).length} />
			</tr> */}
		</>
	);
}

export default LineProduct;
