import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import api from '@src/config/api';
import useAccessTokenAdmin from '@src/hooks/useAccessTokenAdmin';
import { serverApi } from '@src/config/constrant';

const AppContext = createContext();

const ContextProvider = props => {
	const router = useRouter();
	const { children } = props;
	const [user, setUser] = useState(null);
	const [socket, setSocket] = useState(null);
	const accessToken = useAccessTokenAdmin();
	const getLogin = async () => {
		if (user && socket) return;

		if (!accessToken || accessToken == '') return;
		try {
			const res = await api.post(
				'/api/admin',
				{},
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: accessToken,
					},
				}
			);

			const newSocket = io(`${serverApi}/chat`, {
				path: '/socket.io',
				auth: {
					accessToken: accessToken,
				},
			});
			setSocket(newSocket);
			setUser(res.data);
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400) {
					router.push('/login');
				}
			}
		}
	};
	useEffect(() => {
		getLogin();
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, [accessToken]);
	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				socket,
				setSocket,
			}}>
			{children}
		</AppContext.Provider>
	);
};
export const useAppContext = () => useContext(AppContext);
export { ContextProvider, AppContext };
