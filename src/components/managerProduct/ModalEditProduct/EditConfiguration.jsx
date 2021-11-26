import { Button, Descriptions, Input, Modal, Typography, message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { managerProductActions } from '../managerProductSlice';
import { IoAddCircleOutline } from 'react-icons/io5';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import api from '@src/config/api';
import showErrorHelper from '@src/helper/showErrorHelper';

export default function EditConfiguration() {
	const Configuration = useSelector(state => state.managerProduct.modalEditProduct.data.Information.Configuration);
	const Id_Product = useSelector(state => state.managerProduct.modalEditProduct.data.Id_Product);

	const [modalAddInfor, setModalAddInfor] = useState({
		show: false,
		inforKey: '',
		value: '',
	});
	const [modalEditInfor, setModalEditInfor] = useState({
		show: false,
		inforKey: '',
		value: '',
		inforKeyOld: '',
	});
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [showBtnSave, setShowBtnSave] = useState(false);
	const dispatch = useDispatch();
	const accessTokenAdmin = useAccessTokenAdmin();
	const handleAddInfor = () => {
		if (modalAddInfor.inforKey === '' || modalAddInfor.value === '') {
			return message.warn('Trường không được thiếu');
		}
		setShowBtnSave(true);
		// key của Object đồng thời là _id

		// kiểm tra không được trùng key
		const checkUniqe = Configuration.findIndex(item => Object.keys(item).includes(modalAddInfor.inforKey));
		if (checkUniqe !== -1) {
			return message.error('Tên giá trị đã có');
		}
		const newInfor = {
			[modalAddInfor.inforKey]: modalAddInfor.value,
		};

		dispatch(managerProductActions.addConfiguration(newInfor));
		setModalAddInfor({
			...modalAddInfor,
			inforKey: '',
			value: '',
			show: false,
		});
	};
	const handleDelete = keyObj => {
		setShowBtnSave(true);

		dispatch(managerProductActions.deleteConfiguration(keyObj));
	};
	const handleUpdate = () => {
		if (modalEditInfor.inforKey === '' && modalEditInfor.value === '') {
			return message.warn('Trường không được thiếu');
		}
		// key của Object đồng thời là _id

		// kiểm tra không được trùng key
		const checkUniqe = Configuration.findIndex(item => Object.keys(item).includes(modalEditInfor.inforKey));
		if (checkUniqe !== -1) {
			return message.error('Tên giá trị đã có');
		}
		setShowBtnSave(true);

		dispatch(
			managerProductActions.editConfiguration({
				keyObjOld: modalEditInfor.inforKeyOld,
				keyObj: modalEditInfor.inforKey,
				value: modalEditInfor.value,
			})
		);
		message.success('Oke');
		setModalEditInfor({
			...modalEditInfor,
			show: false,
		});
	};
	const handleSubmit = async () => {
		setLoadingSubmit(true);
		try {
			const res = await api.post('/api/admin/editConfiguration', Configuration, {
				headers: {
					'Content-Type': 'application/json',
					authorization: accessTokenAdmin,
					_id: Id_Product,
				},
			});
			dispatch(
				managerProductActions.updateConfigurationForOneProduct({
					Id_Product,
					newConfiguration: Configuration,
				})
			);
			message.success(res.data.message);
			// cập nhật danh sản phẩm

			setShowBtnSave(false);
		} catch (error) {
			showErrorHelper(error);
		}

		setLoadingSubmit(false);
	};
	return (
		<div className="w-full">
			<Descriptions
				title="Thông tin cấu hình sản phẩm"
				bordered
				layout="horizontal"
				size="middle"
				column={1}>
				{Configuration.map((item, key) => {
					const [[keyObj, valueObj]] = Object.entries(item);
					return (
						<Descriptions.Item span={1} key={uuid()} label={keyObj}>
							<div className="flex items-center justify-between gap-1 sm:gap-3">
								<span className="w-full rounded-lg border p-2">{valueObj}</span>

								<Button
									onClick={() => {
										setModalEditInfor({
											...modalEditInfor,
											show: true,
											inforKey: keyObj,
											value: valueObj,
											inforKeyOld: keyObj,
										});
									}}
									type="primary">
									Sửa
								</Button>
								<Popconfirm
									title="Are you sure to delete this task?"
									onConfirm={() => {
										handleDelete(keyObj);
									}}
									okText="Xác nhận xóa"
									okButtonProps={{ danger: true }}
									cancelText="Hủy bỏ">
									<Button danger>Xóa</Button>
								</Popconfirm>
							</div>
						</Descriptions.Item>
					);
				})}
			</Descriptions>
			<div className="w-full flex items-center justify-center p-4">
				<Button
					type="primary"
					ghost
					onClick={() => {
						setModalAddInfor({ ...modalAddInfor, show: true });
					}}>
					Thêm thông tin
				</Button>
				{/* //modal thêm thông tin */}
				<Modal
					visible={modalAddInfor.show}
					okText="Thêm"
					cancelText="Hủy bỏ"
					onOk={() => handleAddInfor()}
					onCancel={() => {
						setModalAddInfor({ ...modalAddInfor, show: false });
					}}>
					<Typography.Title level={4}>Tên thông tin</Typography.Title>
					<Input.TextArea
						value={modalAddInfor.inforKey}
						autoSize
						onChange={e => {
							setModalAddInfor({ ...modalAddInfor, inforKey: e.target.value });
						}}
					/>
					<Typography.Title level={4}>Giá trị</Typography.Title>
					<Input.TextArea
						value={modalAddInfor.value}
						autoSize
						onChange={e => {
							setModalAddInfor({ ...modalAddInfor, value: e.target.value });
						}}
					/>
				</Modal>
				{/* modal sửa thông tin */}
				<Modal
					visible={modalEditInfor.show}
					okText="Lưu"
					cancelText="Hủy bỏ"
					onOk={handleUpdate}
					onCancel={() => {
						setModalEditInfor({ ...modalEditInfor, show: false });
					}}>
					<Typography.Title level={4}>Tên thông tin</Typography.Title>
					<Input.TextArea
						value={modalEditInfor.inforKey}
						autoSize
						onChange={e => {
							setModalEditInfor({ ...modalEditInfor, inforKey: e.target.value });
						}}
					/>
					<Typography.Title level={4}>Giá trị</Typography.Title>
					<Input.TextArea
						value={modalEditInfor.value}
						autoSize
						onChange={e => {
							setModalEditInfor({ ...modalEditInfor, value: e.target.value });
						}}
					/>
				</Modal>
			</div>
			{showBtnSave && (
				<div className="mt-3">
					<Button type="primary" onClick={handleSubmit} block loading={loadingSubmit}>
						Lưu
					</Button>
				</div>
			)}
		</div>
	);
}
