import { Card, Space, Comment, Avatar, Input, Button, message, Pagination as PaginationAntd, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@src/config/api';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import axios from 'axios';
import showErrorHelper from '@src/helper/showErrorHelper';
import ArrayHelper from '@src/helper/ArrayHelper';
import { formatUrlForImage } from '@src/helper/formatHelper';
import { AiOutlineUser } from 'react-icons/ai';
import uuid from 'react-uuid';
import { clientDomain } from '@src/config/constrant';
import Link from 'next/link';
import FormatDate from '@src/helper/FormatDate';
import { useAppContext } from '@src/context';

const CommentItem = props => {
	const {
		_id,
		name,
		role,
		content,
		avatar,
		idComment,
		time,
		activeFormReply,
		setActiveFormReply,
		idProduct,
		setListComment,
	} = props;

	return (
		<Comment
			actions={[
				<span
					onClick={() => setActiveFormReply(_id)}
					key="comment-nested-reply-to"
					className="font-medium text-primary">
					Trả lời
				</span>,
				<span className="ml-2 font-medium text-black" style={{ cursor: 'default' }} key="time">
					{FormatDate(time)}
				</span>,
			]}
			author={
				<div>
					<span className="text-base font-medium text-gray-800">{name}</span>
					{role === 'admin' && (
						<span className="rounded-lg ml-1 py-1 px-2 font-medium text-sm border bg-primary text-white">
							{role}
						</span>
					)}
				</div>
			}
			avatar={
				avatar !== '' ? (
					<Avatar size={64} src={formatUrlForImage(avatar)} alt={name} />
				) : (
					<Avatar
						size={64}
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
						icon={<AiOutlineUser />}
					/>
				)
			}
			content={<p>{content}</p>}>
			<div className="ml-4 border-b pb-4">
				{activeFormReply === _id && (
					<ReplyForm
						idComment={idComment}
						idProduct={idProduct}
						setActiveFormReply={setActiveFormReply}
						setListComment={setListComment}
					/>
				)}
				{props.children}
			</div>
		</Comment>
	);
};
const ReplyForm = props => {
	const { idComment, idProduct, setActiveFormReply, setListComment } = props;
	const [replyContent, setReplyContent] = useState('');
	const accessTokenAdmin = useAccessTokenAdmin();
	const { user } = useAppContext();
	const handleSubmitReplyComment = async () => {
		try {
			const content = replyContent.trim();
			if (content.length === 0) return message.error('Bình luận không hợp lệ');
			const newReply = {
				Id_Product: idProduct,
				Id_Comment: idComment,
				ReplyContent: content,
			};
			const res = await api.post(`/api/admin/addReplyComment/${idProduct}`, newReply, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
			});
			setActiveFormReply('');

			setReplyContent('');

			// thêm bình luận vào màn hình
			const newReplyAddScreen = {
				...res.data,
				ReplyTime: new Date(),
				Name: [user.DisplayName],
				Avatar: [user.Avatar],
			};
			setListComment(pre => {
				return pre.map(item => {
					if (item.Id_Product === idProduct) {
						const commentArr = item.array.map(comment => {
							if (comment._id === idComment) {
								return {
									...comment,
									Reply: [...comment.Reply, newReplyAddScreen],
								};
							}
							return comment;
						});
						return {
							...item,
							array: [...commentArr],
						};
					}
					return item;
				});
			});

			message.success('Thêm bình luận thành công');
		} catch (error) {
			showErrorHelper(error);
		}
	};

	return (
		<div className="flex items-end flex-col gap-2">
			<Input.TextArea
				value={replyContent}
				rows={3}
				placeholder="Để lại bình luận"
				autoFocus={true}
				onChange={e => setReplyContent(e.target.value)}
			/>
			<Button type="primary" onClick={handleSubmitReplyComment}>
				Gửi
			</Button>
		</div>
	);
};
export default function ManagerComment() {
	const router = useRouter();
	const accessTokenAdmin = useAccessTokenAdmin();
	const [inputSearch, setInputSearch] = useState(router.query.query || '');
	const [limitResult, setLimitResult] = useState(10);
	const [pageState, setPageState] = useState(1);
	const [listComment, setListComment] = useState([]);
	const [activeFormReply, setActiveFormReply] = useState('');
	const [loading, setLoading] = useState(false);
	const [mount, setMount] = useState(false);

	// useState(() => {
	// 	setInputSearch(router.query.query || '');
	// 	return () => {};
	// }, [router.query.query]);
	const [metaListComment, setMetaListComment] = useState({
		CountComment: 1,
		Limit: 1,
		Skip: 0,
		Page: 1,
		totalPage: 1,
	});

	const getComment = async cancelTokenSource => {
		setLoading(true);
		try {
			let page;
			let query;
			if (!mount) {
				page = router.query.page || 1;
				query = router.query.query || '';
			} else {
				page = pageState;
				query = inputSearch.trim();
			}
			const res = await api.get(`/api/admin/getComment?query=${query}&page=${page}&limit=${limitResult}`, {
				headers: { 'Content-Type': 'application/json', authorization: accessTokenAdmin },
				cancelToken: cancelTokenSource.token,
			});
			const formatData = ArrayHelper.groupArrayByKey(res.data[0]?.Comment || [], 'Id_Product');
			setListComment(formatData);
			if (res.data[0]?.MetaData[0]) {
				setMetaListComment(res.data[0]?.MetaData[0]);
			} else {
				// set về mặc định nếu không có trong những lần tìm kiếm
				setMetaListComment({ CountComment: 1, Limit: 1, Skip: 0, Page: 1, totalPage: 1 });
			}
		} catch (error) {
			if (error.message === 'cancelToken') {
			} else {
				showErrorHelper(error);
			}
		}
		setLoading(false);
		if (!mount) {
			setMount(!mount);
		}
	};
	useEffect(() => {
		if ((!accessTokenAdmin || accessTokenAdmin == '', !router.isReady)) return;
		const cancelTokenSource = axios.CancelToken.source();
		getComment(cancelTokenSource);
		return () => {
			cancelTokenSource.cancel('cancelToken');
		};
	}, [accessTokenAdmin, router.query.page, router.query.query]);
	const handleSearch = (v, e) => {
		e.preventDefault();
		setPageState(1);

		router.push({
			href: router.pathname,
			query: {
				query: inputSearch.trim(),
				page: 1,
			},
		});
	};
	const handlerPagination = page => {
		setPageState(page);
		router.push(
			{
				href: router.pathname,
				query: {
					query: inputSearch.trim(),
					page: page,
				},
			},
			null
		);
	};
	const handlePageSizeChange = (currentPage, limit) => {
		// limit trang thây đổi
		setLimitResult(limit);
		setPageState(1);
		router.push({
			href: router.pathname,
			query: {
				query: inputSearch.trim(),
				page: 1,
			},
		});
	};
	return (
		<Spin spinning={loading}>
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col gap-8 justify-center py-8 px-3">
					<Space direction="vertical" size="large">
						<Input.Search
							value={inputSearch}
							onChange={e => setInputSearch(e.target.value)}
							onSearch={handleSearch}
							enterButton
						/>
						{listComment.map(item => {
							const ProductName = item?.array[0]?.ProductName;
							const ProductPath = item?.array[0]?.ProductPath;
							const Id_Product = item?.array[0]?.Id_Product;

							return (
								<Card
									title={
										<Link href={`${clientDomain}/${ProductPath}`}>
											<a
												target="_blank"
												className="hover:underline text-primaryDark">
												{ProductName}
											</a>
										</Link>
									}
									key={uuid()}>
									{item.array?.map(comment => {
										//render comment
										return (
											<CommentItem
												key={uuid()}
												_id={comment._id}
												idComment={comment._id}
												name={comment.Name[0]}
												role={comment.Role}
												content={comment.CommentContent}
												avatar={comment.Avatar[0]}
												time={comment.Time}
												activeFormReply={activeFormReply}
												setActiveFormReply={setActiveFormReply}
												idProduct={Id_Product}
												setListComment={setListComment}>
												{comment.ReplyIsEmpty == false &&
													comment.Reply.map(replyComment => {
														//render replyComment
														return (
															<CommentItem
																key={uuid()}
																_id={replyComment._id}
																idComment={comment._id}
																name={
																	replyComment
																		.Name[0]
																}
																role={replyComment.Role}
																content={
																	replyComment.ReplyContent
																}
																avatar={
																	replyComment
																		.Avatar[0]
																}
																time={
																	replyComment.ReplyTime
																}
																activeFormReply={
																	activeFormReply
																}
																setActiveFormReply={
																	setActiveFormReply
																}
																idProduct={Id_Product}
																setListComment={
																	setListComment
																}
															/>
														);
													})}
											</CommentItem>
										);
									})}
								</Card>
							);
						})}
					</Space>
					<PaginationAntd
						showTotal={(total, range) => (
							<div>
								<strong className="mx-1">{range[0]}</strong>
								{'-'}
								<strong className="mx-1">{range[1]}</strong>
								trên
								<strong className="mx-1">{total} bình luận</strong>
							</div>
						)}
						hideOnSinglePage
						onShowSizeChange={handlePageSizeChange}
						// pageSizeOptions={[5, 10, 15, 20, 25]}
						pageSizeOptions={[]}
						pageSize={metaListComment.Limit}
						defaultCurrent={metaListComment.Page}
						total={metaListComment.CountComment}
						defaultPageSize={metaListComment.Limit}
						onChange={handlerPagination}
					/>
				</div>
			</div>
		</Spin>
	);
}
