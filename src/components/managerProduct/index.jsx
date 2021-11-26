import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import Pagination from '@src/components/common/Pagination';
import api from '@src/config/api';
import ArrayHelper from '@src/helper/ArrayHelper';
import showErrorHelper from '@src/helper/showErrorHelper';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { Spin, Button as ButtonAntd } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LineProduct from './LineProduct';
import { ProductContextProvider } from './managerProductContext';
import { managerProductActions } from './managerProductSlice';
import ModalAddProduct from './ModalAddProduct';
import ModalDetailProduct from './ModalDetailProduct';
import ModalEditProduct from './ModalEditProduct';
const uuid = require('react-uuid');
const ManageProduct = () => {
	const router = useRouter();
	const [showLoadingDataTable, setShowLoadingDataTable] = useState(false);
	const dataOfDataTable = useSelector(state => state.managerProduct.dataTable.data);
	const metaOfDataTable = useSelector(state => state.managerProduct.dataTable.metaData);
	const dispatch = useDispatch();
	const accessTokenAdmin = useAccessTokenAdmin();
	const [inputValue, setInputValue] = useState(router.query.query || '');
	const [stateModalDetailProduct, setStateModalDetailProduct] = useState({
		show: false,
		data: {},
	});
	const [loading, setLoading] = useState(false);
	//danh sách select của nhóm sản phẩm
	//láy danh sách nhóm sản phẩm
	const handleGetGroupProduct = async cancelTokenSource => {
		try {
			const res = await api.get('/api/admin/getGroupProductOption', {
				headers: {
					authorization: accessTokenAdmin,
				},
				cancelToken: cancelTokenSource.token,
			});
			dispatch(managerProductActions.setGroupProductOption(res.data));
		} catch (error) {
			showErrorHelper(error);
		}
	};
	// goi api lấy ản phẩm
	const getProducts = async cancelTokenSource => {
		const query = router.query.query || '^';
		const page = router.query.page || 1;
		setLoading(false);
		setShowLoadingDataTable(true);
		try {
			const res = await api.get(
				'/api/admin/getProducts?query=' + query + '&page=' + page + '&limit=' + 13,
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },

					cancelToken: cancelTokenSource.token,
				}
			);

			dispatch(managerProductActions.setDataOfDataTable(res.data.data));
			dispatch(managerProductActions.setMetaOfDataTable(res.data.metaData));
		} catch (error) {
			showErrorHelper(error);
		}
		setShowLoadingDataTable(false);
		setLoading(true);
	};
	useEffect(() => {
		if (!accessTokenAdmin || accessTokenAdmin == '' || !router.isReady) return;
		const cancelTokenSource = axios.CancelToken.source();
		getProducts(cancelTokenSource);
		handleGetGroupProduct(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, [accessTokenAdmin, router.isReady, router.query.query, router.query.page]);

	const handleSearch = async e => {
		e.preventDefault();
		router.push(
			{
				href: router.pathname,
				query: {
					query: inputValue.trim(),
					page: 1,
				},
			},
			null
		);
	};
	const handleShowModalAdd = () => {
		dispatch(managerProductActions.setShowModalAdd(true));
	};
	return (
		<ProductContextProvider>
			<Spin spinning={showLoadingDataTable}>
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
								placeholder="Tìm kiếm tên sản phẩm"
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
						<div className="max-w-sm mx-auto my-4 ">
							<ButtonAntd onClick={handleShowModalAdd} type="primary" block>
								Thêm sản phẩm mới
							</ButtonAntd>
						</div>
						{/* loading */}
						{/* <ProgressLoading show={showLoadingDataTable} /> */}

						{/* --- */}
						<div className="flex items-center justify-between px-2 md:px-12">
							<div className="text-gray-900 text-sm font-medium mb-6">
								{(() => {
									if (!loading) return null;
									if (dataOfDataTable.length === 0)
										return <span>Không có sản phẩm nào</span>;
									return (
										<span>
											Trang: {metaOfDataTable[0].page} từ{' '}
											{metaOfDataTable[0].skip + 1} -{' '}
											{metaOfDataTable[0].skip + dataOfDataTable.length}{' '}
											trên {metaOfDataTable[0].total}
										</span>
									);
								})()}
							</div>
							{/* {(() => {
                                    if (dataTable.data.length === 0) {
                                          return null
                                    }
                                    const newDataFormat = dataTable.data.map((data) => {
                                          return {
                                                "ID Người dùng": data._id,
                                                "Tên": data.Name,
                                                "Số điện thoại": data.PhoneNumber,
                                                "Địa chỉ": `Tỉnh/Thành phố: ${data.Address.City} - Quận/huyện: ${data.Address.District} - Xã/Thị trấn: ${data.Address.Wards} - Chi tiết: ${data.Address.Details}`,
                                                "Ngày tạo tài khoản": FormatDate(data.createdAt)
                                          }
                                    })

                                    return <ExportExcel csvData={newDataFormat} fileName="Quan_li_san_pham" />
                              })()} */}
						</div>
						<div className="bg-gray-100 flex font-sans overflow-auto">
							<div className="w-full mx-auto px-6">
								<div className="bg-white min-w-max shadow-md rounded my-6 relative overflow-y-auto max-h-full">
									<table className="min-w-max w-full table-auto ">
										<thead>
											<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
												{[
													'Hình ảnh',
													'Tên sản phẩm',
													'Tên nhóm sản phẩm',
													'Ngày tạo',
													'Số sản phẩm đã bán',
													'Giá bán ra',
													'Giá khuyến mại',
													'Số lượng còn trong kho',
													'Số lượt xem',
													'Sao đánh giá',
													'Số đánh giá',
													'Số bình luận',
													'Hành động',
												].map(x => (
													<th
														key={uuid()}
														scope="col"
														className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-xs font-semibold sticky top-0 shadow">
														{x}
													</th>
												))}
											</tr>
										</thead>
										<tbody className="text-gray-600 text-xs font-medium">
											{(() => {
												const dataFormat = ArrayHelper.groupArrayByKey(
													dataOfDataTable,
													'_id'
												);
												return dataFormat.map((x, key) => (
													<LineProduct
														data={x.array}
														key={uuid()}
														index={key}
														setStateModalDetailProduct={
															setStateModalDetailProduct
														}
													/>
												));
											})()}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					{loading && metaOfDataTable.length !== 0 && (
						<div className="my-8">
							<Pagination
								className="justify-center"
								totalCount={metaOfDataTable[0].total}
								currentPage={metaOfDataTable[0].page}
								pageSize={metaOfDataTable[0].limit}
								url={`${router.pathname}?query=${inputValue}&page=`}
							/>
						</div>
					)}
					<ModalDetailProduct
						state={stateModalDetailProduct}
						setState={setStateModalDetailProduct}
					/>
					<ModalEditProduct />
					<ModalAddProduct />
				</div>
			</Spin>
		</ProductContextProvider>
	);
};

export default ManageProduct;
