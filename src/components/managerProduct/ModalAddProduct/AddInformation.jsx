import { Descriptions, Input, Select, Space } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { useProductContext } from '../managerProductContext';
import { managerProductActions } from '../managerProductSlice';
export default function AddInformation() {
	const { modalAddProduct, setModalAddProduct } = useProductContext();
	const groupProductOption = useSelector(state => state.managerProduct.groupProductOption);
	const { ProductName, GroupProduct, Price, PriceSale, RemainingAmount } = modalAddProduct.addInformations;
	return (
		<Space direction="vertical" size="large" style={{ width: '100%', margin: '1rem 0' }}>
			<Descriptions title="Thông tin sản phẩm" bordered layout="horizontal" size="middle" column={1}>
				<Descriptions.Item label="Tên sản phẩm">
					<Input.TextArea
						onChange={e => {
							setModalAddProduct(prev => ({
								...prev,
								addInformations: {
									...prev.addInformations,
									ProductName: e.target.value,
								},
							}));
						}}
						autoSize
						value={ProductName}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Thuộc nhóm sản phẩm">
					<Select
						onChange={e => {
							setModalAddProduct(prev => ({
								...prev,
								addInformations: {
									...prev.addInformations,
									GroupProduct: e,
								},
							}));
						}}
						value={GroupProduct}
						style={{ width: '100%' }}>
						{groupProductOption.map((item, key) => {
							return (
								<Select.Option value={item._id} key={uuid()}>
									{item.GroupName}
								</Select.Option>
							);
						})}
					</Select>
				</Descriptions.Item>
				{/* <Descriptions.Item label="Ngày tạo">{data.createdAt}</Descriptions.Item> */}
				<Descriptions.Item label="Giá bán ra">
					<Input
						value={Price}
						suffix="VNĐ"
						type="number"
						onChange={e => {
							setModalAddProduct(prev => ({
								...prev,
								addInformations: {
									...prev.addInformations,
									Price: e.target.value,
								},
							}));
						}}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Giá khuyến mại">
					<Input
						type="number"
						value={PriceSale}
						suffix="VNĐ"
						onChange={e => {
							setModalAddProduct(prev => ({
								...prev,
								addInformations: {
									...prev.addInformations,
									PriceSale: e.target.value,
								},
							}));
						}}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="Số lượng trong kho">
					<Input
						value={RemainingAmount}
						suffix="VNĐ"
						type="number"
						onChange={e => {
							setModalAddProduct(prev => ({
								...prev,
								addInformations: {
									...prev.addInformations,
									RemainingAmount: e.target.value,
								},
							}));
						}}
					/>
				</Descriptions.Item>
			</Descriptions>
		</Space>
	);
}
