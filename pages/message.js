import SlidesMessItem from '@src/components/message/SlidesMessItem';
import LineMess from '@src/components/message/LineMess';
import Button from '@material-tailwind/react/Button';
import { useState, useEffect, createRef, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useAppContext } from '@src/context';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import uuid from 'react-uuid';
function Message() {
	const [lineMessArray, setLineMessArray] = useState([]);
	const [slideBarMess, setSlideBarMess] = useState([]);
	const { user, setUser, socket } = useAppContext();
	const { enqueueSnackbar } = useSnackbar();
	const [chatOnFocus, setChatOnFocus] = useState(false);
	const BodyMessage = useRef(null);
	const [messActivity, setMessageActivity] = useState('');
	const messActivityRef = useRef(null);
	const messagesEndRef = useRef(null);
	const [input, setInputValue] = useState('');
	const bodyMessageScrollToBottom = useRef(false);
	useEffect(() => {
		const scrollBottom = function (event) {
			const { currentTarget: target } = event;
			if (target.offsetHeight + target.scrollTop >= target.scrollHeight) {
				bodyMessageScrollToBottom.current = true;
				// target.scroll({ top: target.scrollHeight, behavior: "smooth" });
			} else {
				bodyMessageScrollToBottom.current = false;
			}
			// check if user scroll not bottom
			// controller.abort();
		};
		const controller = new AbortController();
		BodyMessage.current.addEventListener(
			'scroll',
			scrollBottom,
			{ signal: controller.signal },
			{
				passive: true,
			},
			true
		);
		return () => {
			controller.abort();
		};
	}, []);
	useEffect(() => {
		if (socket) {
			socket.emit('getSileBarMessage');
			socket.on('sileBarMessage', data => {
				setSlideBarMess(data);
				socket.emit('getUsersOnline', null);
			});
			socket.on('getMessageUser', messData => {
				// để tránh tình trạng hai thiết bị cùng nhận đc
				// ta kiểm tra accessToken
				// hoặc tạo id riêng trên mỗi thiết bị
				// nhưng ở đây ta dùng accessToken

				setLineMessArray(messData);
				bodyMessageScrollToBottom.current = false;
			});
			socket.on('message', (messData, userId) => {
				if (messActivityRef.current == userId) {
					setLineMessArray(oldArray => [...oldArray, messData]);
				}
				scrollToBottom();
				setSlideBarMess(pre => {
					let findIdex = -1;
					let newSLideBarMessage = {};
					for (let index = 0; index < pre.length; index++) {
						if (userId === pre[index]._id) {
							findIdex = index;
							newSLideBarMessage = {
								...pre[index],
								Message: {
									...pre[index].Message,
									MessengerContent: messData.MessengerContent,
									Time: Date.now(),
								},
							};
							break;
						}
					}
					if (findIdex !== -1) {
						// const newPre = pre.filter()
						pre.splice(findIdex, 1);
						pre.unshift(newSLideBarMessage);
						return [...pre];
					}
					return [...pre];
				});
			});
			socket.on('deleteMessageResult', data => {
				if (data.check == false) {
					return enqueueSnackbar('Xóa tin nhắn của ' + data.Name + ' không thành công!', {
						variant: 'error',
					});
				}
				if (messActivityRef.current === data._id) {
					setLineMessArray([]);
				}
				enqueueSnackbar('Xóa tin nhắn của ' + data.Name + ' thành công!', { variant: 'success' });
				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						if (data._id === pre[index]._id) {
							if (pre[index]?.Message?.MessengerContent) {
								pre[index].Message.MessengerContent = '';
							}
							if (pre[index]?.Message?.Time) {
								pre[index].Message.Time = '';
							}

							break;
						}
					}
					return [...pre];
				});
			});
			socket.on('inputOnFocus', userId => {
				// nếu tag đang hoạt dộng bằng với user id thì
				// hiển thị biểu tượng đang nhập

				if (messActivityRef.current === userId) {
					setChatOnFocus(pre => !pre);
				}
				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						if (userId === pre[index]._id) {
							pre[index].userFocus = true;
							break;
						}
					}
					return [...pre];
				});
				scrollToBottom();
			});
			socket.on('inputOnBlur', userId => {
				if (messActivityRef.current === userId) {
					setChatOnFocus(pre => !pre);
				}
				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						if (userId === pre[index]._id) {
							pre[index].userFocus = false;
							break;
						}
					}
					return [...pre];
				});
				// ---
				scrollToBottom();
			});
			socket.on('oneUserOnline', userId => {
				let NameUserOnline = '';

				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						if (userId === pre[index]._id) {
							pre[index].LastTimeActive = 'Đang hoạt động';
							NameUserOnline = pre[index].Name;

							break;
						}
					}
					return [...pre];
				});
				enqueueSnackbar(NameUserOnline + ' đã online', {
					// variant: "info",
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'right',
					},
					content: (key, me) => (
						<div className="p-2 rounded-lg flex items-center justify-center bg-primaryDark shadow-md">
							<span className="text-xs font-medium text-white">{me}</span>
						</div>
					),
				});
				socket.emit('adminJoinRoomWhenNewUserConnected', userId);
			});
			socket.on('usersOnline', (arrayUserOnline = []) => {
				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						arrayUserOnline.forEach(userId => {
							if (userId === pre[index]._id) {
								pre[index].LastTimeActive = 'Đang hoạt động';
								return false;
							}
						});
					}
					return [...pre];
				});
			});
			socket.on('usersOffline', (userId, lastTimeActive) => {
				let NameUserOffline = '';
				setSlideBarMess(pre => {
					for (let index = 0; index < pre.length; index++) {
						if (userId === pre[index]._id) {
							pre[index].LastTimeActive = lastTimeActive;
							NameUserOffline = pre[index].Name;
							pre[index].userFocus = false;
							break;
						}
					}
					return [...pre];
				});
				if (messActivityRef.current == userId) {
					setChatOnFocus(false);
				}
				enqueueSnackbar(NameUserOffline + ' đã offline', {
					// variant: "info",
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'right',
					},
					content: (key, me) => (
						<div className="p-2 rounded-lg flex items-center justify-center bg-gray-700 shadow-md">
							<span className="text-xs font-medium text-white">{me}</span>
						</div>
					),
				});

				socket.emit('adminLeaveRoomWhenNewUserDisconnect', userId);
			});
		}
		return () => {
			if (socket) {
				[
					'inputOnFocus',
					'inputOnBlur',
					'sileBarMessage',
					'getMessageUser',
					'message',
					'usersOnline',
					'oneUserOnline',
					'usersOffline',
					'onFocus',
					'deleteMessageResult',
				].forEach(e => {
					socket.removeAllListeners(e);
				});
			}
		};
	}, [socket]);

	useEffect(() => {
		if (socket) {
			socket.emit('getMessage', messActivity);
			bodyMessageScrollToBottom.current = true;
		}
		return () => {
			// if (socket) {
			// 	socket.removeAllListeners('getMessage');
			// }
		};
	}, [socket, messActivity]);
	const handleSlideMessOnClick = userId => {
		messActivityRef.current = userId;

		setMessageActivity(userId);
	};

	const handle_sendMess = e => {
		e.preventDefault();
		if (input.trim() == '') {
			return;
		}
		if (socket && messActivity != '') {
			socket.emit('sendMessage', {
				To: messActivity,
				MessengerContent: input.trim(),
				Avatar: user.Avatar,
			});
			setInputValue('');
		}
	};
	const handleDeleteMessage = userId => {
		if (socket) {
			socket.emit('deleteMessage', userId);
		}
	};
	const scrollToBottom = () => {
		if (bodyMessageScrollToBottom.current) {
			if (messagesEndRef.current.scrollIntoView) {
				return messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
			}
			BodyMessage.current.scrollTo({
				top: Number.MAX_SAFE_INTEGER,
				left: 0,
				behavior: 'smooth',
			});
		}
	};

	useEffect(scrollToBottom, [lineMessArray]);
	return (
		<div className="flex w-full h-full relative overflow-hidden">
			<div className="md:w-[320px] w-full absolute bg-white  inset-0  overflow-y-scroll">
				<ul>
					{slideBarMess.map((data, key) => {
						return (
							<SlidesMessItem
								key={uuid()}
								data={data}
								handleDelete={handleDeleteMessage}
								onClick={() => {
									handleSlideMessOnClick(data._id);
								}}
							/>
						);
					})}
				</ul>
			</div>
			<div className="md:w-[calc(100%-320px)] w-full md:ml-[320px] flex flex-col justify-between">
				{/* body mess */}
				<div ref={BodyMessage} className="flex-auto flex flex-col w-full overflow-y-scroll">
					{lineMessArray.map(data => {
						return <LineMess key={uuid()} data={data} />;
					})}
					{chatOnFocus && (
						<div className="my-4 flex-grow px-10 relative flex items-end py-1  w-full">
							<div className="dot-falling"></div>
						</div>
					)}
					<div className="h-0" ref={messagesEndRef} />
				</div>

				<form
					onSubmit={handle_sendMess}
					className="py-2 px-4 shadow-xl w-full flex items-center justify-between bg-gray-300">
					<div className="w-10/12">
						<input
							onFocus={() => {
								if (socket && messActivity != '') {
									socket.emit('OnFocus', messActivity);
								}
							}}
							onBlur={() => {
								if (socket && messActivity != '') {
									socket.emit('OnBlur', messActivity);
								}
							}}
							type="text"
							className="outline-none px-4 py-2 w-full bg-gray-50 rounded-2xl"
							value={input}
							onChange={e => setInputValue(e.target.value)}
						/>
					</div>
					<Button
						disabled={input.trim() === '' || messActivity == ''}
						type="submit"
						className="disabled:bg-gray-500"
						color="cyan"
						buttonType="filled"
						size="regular"
						rounded={false}
						block={false}
						iconOnly={false}
						ripple="light">
						Gửi
					</Button>
				</form>
			</div>
		</div>
	);
}

export default Message;
