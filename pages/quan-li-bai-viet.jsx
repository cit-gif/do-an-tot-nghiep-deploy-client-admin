import api from '@src/config/api';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { Button, message, Space, Table, Tooltip, Input, Popconfirm, Modal, Typography, Upload } from 'antd';
import { data } from 'autoprefixer';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';
import dynamic from 'next/dynamic';
import { formatUrlForImage } from '@src/helper/formatHelper';
import { serverApi } from '@src/config/constrant';
const Editor = dynamic(() => import('@src/components/QuillEditor'), {
	ssr: false,
});
const limitPostResult = 20;
function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
export default function Post() {
	const [listPost, setListPost] = useState([]);
	const [loading, setLoading] = useState(false);
	const accessTokenAdmin = useAccessTokenAdmin();
	const [pagination, setPagination] = useState({ pageSize: 1, total: 1, current: 1 });
	const router = useRouter();
	const [inputSearch, setInputSearch] = useState(router.query.query || '');
	const [modalCreate, setModalCreate] = useState({
		isVisible: false,
		TitlePost: '',
		ThumbImage: {
			url: null,
			file: null,
		},
		ContentPost: {
			html: '',
			deltaOps: {},
		},
	});
	//chỉnh sửa
	const [modalEdit, setModalEdit] = useState({
		IdPost: '',
		isVisible: false,
		TitlePost: '',
		ThumbImage: {
			url: null,
			file: null,
		},
		ContentPost: {
			html: '',
			deltaOps: {},
		},
	});
	const [contentDefaultCreate, setContentDefaultCreate] = useState('');
	const [contentDefaultEdit, setContentDefaultEdit] = useState('');

	// console.log('ip', inputSearch);
	const getDataPost = async cancelTokenSource => {
		if (!accessTokenAdmin) return;
		setLoading(true);
		const query = router.query.query || '^';
		const page = router.query.page || '1';

		try {
			const res = await api.get(`/api/getPost?query=${query}&page=${page}&limit=${limitPostResult}`, {
				headers: {
					authorization: accessTokenAdmin,
				},
				cancelToken: cancelTokenSource.token,
			});

			setListPost(res?.data[0]?.data || []);
			setPagination({
				...pagination,
				pageSize: res.data[0]?.metaData[0]?.limit,
				total: res.data[0]?.metaData[0]?.total,
				current: res.data[0]?.metaData[0]?.page || 1,
			});
		} catch (error) {
			message.error('Đã có lỗi');
		}
		setLoading(false);
	};
	const handlerDelete = async _id => {
		try {
			const res = await api.post(
				'/api/admin/deletePost',
				{
					_id,
				},
				{
					headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				}
			);
			setListPost(prev => {
				return prev.filter(item => {
					if (item._id !== _id) {
						return item;
					}
				});
			});
			message.success('Đã xóa thành công');
		} catch (error) {
			message.error('Đã có lỗi');
		}
	};
	const columns = [
		{ title: 'Id', dataIndex: '_id' },
		// { title: 'Hình ảnh', dataIndex: '' },

		{ title: 'Tên bài viết', dataIndex: 'Title' },

		{ title: 'Ngày tạo', dataIndex: 'createdAt' },
		{
			title: 'Hành động',

			render: post => {
				return (
					<Space size="large">
						<Button
							type="primary"
							onClick={() => {
								setModalEdit({
									...modalCreate,
									IdPost: post._id,
									isVisible: true,
									TitlePost: post.Title,
									ContentPost: {
										html: post?.Content?.html || '',
										deltaOps: post?.Content?.deltaOps || {},
									},
									ThumbImage: {
										file: null,
										url: formatUrlForImage(post.ThumbImage),
									},
								});
								setContentDefaultEdit(post.Content?.html);
							}}>
							Sửa
						</Button>
						<Popconfirm
							title="Bạn có chắc chắn muốn xóa bài viết này"
							onConfirm={() => {
								handlerDelete(post._id);
							}}
							okButtonProps={{
								danger: true,
							}}
							okText="Xác nhận xóa"
							cancelText="Không">
							<Button type="ghost" danger>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				);
			},
		},
	];
	const handlerPagination = page => {
		router.push(
			{
				href: router.pathname,
				query: {
					page: page,
					query: inputSearch,
				},
			},
			null
		);
	};
	const handleSearch = () => {
		router.push(
			{
				href: router.pathname,
				query: {
					page: 1,
					query: inputSearch,
				},
			},
			null
		);
	};
	useEffect(() => {
		// gàn giá trị từ query url cho input
		setInputSearch(router.query.query || '');
	}, []);
	useEffect(() => {
		if (!router.isReady) return;
		const cancelTokenSource = axios.CancelToken.source();
		getDataPost(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, [router.query.query, router.query.page, accessTokenAdmin, router.isReady]);
	// ---------tạo bài viết
	const onContentPostCreateChange = (html, deltaOps) => {
		setModalCreate(prev => ({
			...prev,
			ContentPost: {
				html: html,
				deltaOps: deltaOps,
			},
		}));
	};
	const handleThumbImageCreateChange = info => {
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, imageUrl => {
				setModalCreate({
					...modalCreate,
					ThumbImage: {
						url: imageUrl,
						file: info.file.originFileObj,
					},
				});
			});
		}
	};
	const handleCreatePost = async () => {
		try {
			if (modalCreate.TitlePost.trim().length === 0) return message.error('Tên bài viết không hợp lệ');
			if (!modalCreate.ThumbImage.file) return message.error('Chưa chọn hình ảnh');
			const newFormData = new FormData();
			newFormData.append('image', modalCreate.ThumbImage.file);
			newFormData.append('Title', modalCreate.TitlePost);
			newFormData.append('Content', JSON.stringify(modalCreate.ContentPost));

			const res = await api.post('/api/admin/createPost', newFormData, {
				headers: {
					'Content-Type': 'application/json',
					authorization: accessTokenAdmin,
				},
			});
			//cập nhật danh sách post
			setListPost([res.data, ...listPost]);
			//cập nhật modal

			setModalCreate({
				...modalCreate,
				isVisible: false,
				TitlePost: '',
				ThumbImage: {
					url: null,
					file: null,
				},
				ContentPost: {
					html: '',
					deltaOps: {},
				},
			});
			//cập nhật lại conten modal create

			setContentDefaultCreate('');
			// cập nhật lại phân trang
			setPagination(prev => ({
				...prev,
				total: prev.total + 1,
			}));
			message.success('Tạo bài viết thành công');
		} catch (error) {
			if (error?.response?.data?.message) {
				return message.error(error?.response?.data?.message);
			}
			message.error('Tạo bài viết không thành công');
		}
	};
	//----------------- chỉnh sửa bài viết
	const onContentPostEditChange = (html, deltaOps) => {
		setModalEdit(prev => ({
			...prev,
			ContentPost: {
				html: html,
				deltaOps: deltaOps,
			},
		}));
	};
	const handleThumbImageEditChange = info => {
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, imageUrl => {
				setModalEdit(pre => ({
					...pre,
					ThumbImage: {
						url: imageUrl,
						file: info.file.originFileObj,
					},
				}));
			});
		}
	};
	const handleSubmitEditPost = async () => {
		try {
			if (modalEdit.TitlePost.trim().length === 0) return message.error('Tên bài viết không hợp lệ');
			let dataSubmit;
			let isEditImage = false; // người dùng có chỉnh sửa ảnh ko
			if (modalEdit.ThumbImage.file) {
				// nếu người dùng muốn thay đổi hình ảnh hiển thị
				isEditImage = true;
				dataSubmit = new FormData();
				dataSubmit.append('image', modalEdit.ThumbImage.file);
				dataSubmit.append('Title', modalEdit.TitlePost);
				dataSubmit.append('IdPost', modalEdit.IdPost);
				dataSubmit.append('Content', JSON.stringify(modalEdit.ContentPost));
			} else {
				dataSubmit = {
					IdPost: modalEdit.IdPost,
					Title: modalEdit.TitlePost,
					Content: modalEdit.ContentPost,
				};
			}
			const res = await api.post('/api/admin/editPost', dataSubmit, {
				headers: {
					'Content-Type': 'application/json',
					authorization: accessTokenAdmin,
					'edit-image': isEditImage ? true : false,
				},
			});
			//cập nhật danh sách post
			setListPost(pre =>
				pre.map(item => {
					if (item._id === modalEdit.IdPost) {
						return {
							...item,
							Title: modalEdit.TitlePost,
							Content: modalEdit.TitlePost,
							ThumbImage:
								res.data.newImageUrl !== '' ? res.data.newImageUrl : item.ThumbImage,
						};
					}
					return item;
				})
			);
			//cập nhật modal

			setModalEdit({
				...modalEdit,
				isVisible: false,
				TitlePost: '',
				ThumbImage: {
					url: null,
					file: null,
				},
				ContentPost: {
					html: '',
					deltaOps: {},
				},
			});
			//cập nhật lại conten modal deit

			setContentDefaultEdit('');

			message.success(res.data?.message || 'Lưu thành công');
		} catch (error) {
			console.log(error);
			if (error?.response?.data?.message) {
				return message.error(error?.response?.data?.message);
			}
			message.error('Lưu không thành công');
		}
	};
	return (
		<div className="mt-4 w-full flex items-center justify-center">
			<Space size="large" direction="vertical">
				<Input.Search
					value={inputSearch}
					onChange={e => {
						setInputSearch(e.target.value);
					}}
					onSearch={handleSearch}
					placeholder="Tìm kiếm"
				/>
				<Button
					onClick={() => {
						setModalCreate({ ...modalCreate, isVisible: true });
					}}
					size="large"
					block
					type="primary">
					Tạo bài viết mới
				</Button>
				<Table
					dataSource={listPost.length !== 0 ? listPost : null}
					bordered
					loading={loading}
					showHeader
					columns={columns}
					pagination={{
						position: 'bottom',
						pageSize: pagination?.pageSize,
						total: pagination?.total || 1,
						current: pagination.current || 1,
						onChange: handlerPagination,
					}}
					rowKey="_id" // id của post
				/>
			</Space>
			<Modal
				width={1000}
				title="Tạo bài viết mới"
				visible={modalCreate.isVisible}
				onCancel={() => {
					setModalCreate({
						...modalCreate,
						isVisible: false,
					});
				}}
				onOk={handleCreatePost}>
				<div className="flex flex-col">
					<Space direction="vertical">
						<Typography.Title level={4}>Hình ảnh bài viết</Typography.Title>
						{modalCreate.ThumbImage.url && (
							<img
								className="max-h-64"
								src={formatUrlForImage(modalCreate.ThumbImage.url)}
								alt="Thumb bài viết"
							/>
						)}
						<Upload
							customRequest={() => {}}
							accept=".jpg,.png"
							multiple={false}
							name="image"
							showUploadList={false}
							beforeUpload={beforeUpload}
							onChange={handleThumbImageCreateChange}>
							<Button type="primary">Thay đổi hình ảnh bài viết</Button>
						</Upload>
					</Space>
					<Space direction="vertical">
						<Typography.Title level={4}>Tên bài viết</Typography.Title>
						<Input
							size="large"
							placeholder="Tên bài viết"
							value={modalCreate.TitlePost}
							onChange={e => {
								setModalCreate({
									...modalCreate,
									TitlePost: e.target.value,
								});
							}}
						/>
					</Space>
					<Space direction="vertical">
						<Typography.Title level={4}>Nội dùng bài viết</Typography.Title>
						<Editor
							onContentChange={onContentPostCreateChange}
							// setEditorContent={setEditorContent}
							editorContentDefault={contentDefaultCreate}
						/>
					</Space>
				</div>
			</Modal>
			{/* modal chỉnh sửa */}
			<Modal
				width={1000}
				title="Chỉnh sửa bài viết"
				visible={modalEdit.isVisible}
				onCancel={() => {
					setModalEdit({
						...modalEdit,
						isVisible: false,
					});
				}}
				onOk={handleSubmitEditPost}>
				<div className="flex flex-col">
					<Space direction="vertical">
						<Typography.Title level={4}>Hình ảnh bài viết</Typography.Title>
						{modalEdit.ThumbImage.url && (
							<img
								className="max-h-64"
								src={modalEdit.ThumbImage.url}
								alt="Thumb bài viết"
							/>
						)}
						<Upload
							customRequest={() => {}}
							accept=".jpg,.png"
							multiple={false}
							name="image"
							showUploadList={false}
							beforeUpload={beforeUpload}
							onChange={handleThumbImageEditChange}>
							<Button type="primary">Thay đổi hình ảnh bài viết</Button>
						</Upload>
					</Space>
					<Space direction="vertical">
						<Typography.Title level={4}>Tên bài viết</Typography.Title>
						<Input
							size="large"
							placeholder="Tên bài viết"
							value={modalEdit.TitlePost}
							onChange={e => {
								setModalEdit({
									...modalEdit,
									TitlePost: e.target.value,
								});
							}}
						/>
					</Space>
					<Space direction="vertical">
						<Typography.Title level={4}>Nội dùng bài viết</Typography.Title>
						<Editor
							onContentChange={onContentPostEditChange}
							// setEditorContent={setEditorContent}
							editorContentDefault={contentDefaultEdit}
						/>
					</Space>
				</div>
			</Modal>
		</div>
	);
}
