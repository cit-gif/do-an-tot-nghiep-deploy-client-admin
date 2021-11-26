import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Input, message, Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { managerProductActions } from '../managerProductSlice';
import api from '@src/config/api';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import showErrorHelper from '@src/helper/showErrorHelper';
export default function EditInformation() {
	/**
	 * không cho thây đổi nhóm sản phẩm
	 * vì hai loại khác nhau
	 * hình ảnh ở thư mục khác nhâu
	 * chỉ cho chọn 1 lần khi tạo sản phẩm
	 */
	const Id_Product = useSelector(state => state.managerProduct.modalEditProduct.data.Id_Product);
	const GroupName = useSelector(state => state.managerProduct.modalEditProduct.data.GroupName);

	const ProductName = useSelector(state => state.managerProduct.modalEditProduct.data.ProductName);
	const Price = useSelector(state => state.managerProduct.modalEditProduct.data.Information.Price);
	const PriceSale = useSelector(state => state.managerProduct.modalEditProduct.data.Information.PriceSale);
	const RemainingAmount = useSelector(
		state => state.managerProduct.modalEditProduct.data.Information.RemainingAmount
	);
	const Views = useSelector(state => state.managerProduct.modalEditProduct.data.Views);
	const Star = useSelector(state => state.managerProduct.modalEditProduct.data.Star);
	const CountEvaluate = useSelector(state => state.managerProduct.modalEditProduct.data.CountEvaluate);

	const CountComment = useSelector(state => state.managerProduct.modalEditProduct.data.CountComment);

	// const groupProductOption = useSelector(state => state.managerProduct.modalEditProduct.groupProductOption);
	const showModalEditProduct = useSelector(state => state.managerProduct.modalEditProduct.show);

	const dispatch = useDispatch();
	const [showBtnSave, setShowBtnSave] = useState(false); // hiển thị button khi người dùng thây đổi thông tin
	const accessTokenAdmin = useAccessTokenAdmin();
	useEffect(() => {
		// xem sự thây đỏi của show modal
		// nếu người dùng đóng thì ẩn button save đi
		if (showModalEditProduct === false) {
			setShowBtnSave(false);
		}
	}, [showModalEditProduct]);

	const handleSubmit = async () => {
		try {
			const dataSubmit = {
				Id_Product: Id_Product,
				ProductName: ProductName,
				Price: Price,
				PriceSale: PriceSale,
				RemainingAmount: RemainingAmount,
			};
			const res = await api.post('/api/admin/editInformationProduct', dataSubmit, {
				headers: {
					'Content-Type': 'application/json',
					authorization: accessTokenAdmin,
				},
			});
			// cập nhật lại cho danh sách sản phẩm
			dispatch(managerProductActions.updateInformationForOneProduct(dataSubmit));
			setShowBtnSave(false);
			message.success(res.data.message);
		} catch (error) {
			showErrorHelper(error);
		}
	};

	return (
		<Space direction="vertical" size="large" style={{ width: '100%', margin: '1rem 0' }}>
			<Descriptions title="Thông tin sản phẩm" bordered layout="horizontal" size="middle" column={1}>
				<Descriptions.Item label="Tên sản phẩm">
					<Input.TextArea
						onChange={e => {
							if (!showBtnSave) {
								setShowBtnSave(true);
							}

							dispatch(managerProductActions.setProductNameForModalEdit(e.target.value));
						}}
						autoSize
						value={ProductName}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Thuộc nhóm sản phẩm">
					{GroupName}
					{/* <Select
						onChange={() => {
							setShowBtnSave(true);
						}}
						defaultValue={data._id}
						style={{ width: '100%' }}>
						{groupProductOption.map((item, key) => {
							return (
								<Select.Option value={item._id} key={uuid()}>
									{item.GroupName}
								</Select.Option>
							);
						})}
					</Select> */}
				</Descriptions.Item>
				{/* <Descriptions.Item label="Ngày tạo">{data.createdAt}</Descriptions.Item> */}
				<Descriptions.Item label="Giá bán ra">
					<Input
						value={Price}
						suffix="VNĐ"
						type="number"
						onChange={e => {
							if (!showBtnSave) {
								setShowBtnSave(true);
							}

							dispatch(managerProductActions.setPriceForModalEdit(e.target.value));
						}}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Giá khuyến mại">
					<Input
						type="number"
						value={PriceSale}
						suffix="VNĐ"
						onChange={e => {
							if (!showBtnSave) {
								setShowBtnSave(true);
							}

							dispatch(managerProductActions.setPriceSaleForModalEdit(e.target.value));
						}}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Số lượng trong kho">
					<Input
						value={RemainingAmount}
						suffix="VNĐ"
						type="number"
						onChange={e => {
							if (!showBtnSave) {
								setShowBtnSave(true);
							}

							dispatch(
								managerProductActions.setRemainingAmountForModalEdit(e.target.value)
							);
						}}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Số lượt xem">{Views}</Descriptions.Item>
				<Descriptions.Item label="Sao đánh giá">{Star}</Descriptions.Item>
				<Descriptions.Item label="Số đánh giá">{CountEvaluate}</Descriptions.Item>
				<Descriptions.Item label="Số bình luận">{CountComment}</Descriptions.Item>
			</Descriptions>
			{showBtnSave && (
				<Button onClick={handleSubmit} block type="primary">
					Lưu
				</Button>
			)}
		</Space>
	);
}
