import { useState } from "react";
import { PersonCircle, Unlock } from "react-bootstrap-icons";
import api from "@src/config/api";
import { login } from "@src/helper/validate";
import { setCookie } from "@src/helper/helpCookie";
import { useRouter } from "next/router";
import Cookies from "cookies";
import { data } from "autoprefixer";
function Login() {
	const [state, setState] = useState({
		UserName: "",
		Password: "",
		Check: true,
	});
	const router = useRouter();
	const handleLogin = async (e) => {
		e.preventDefault();
		if (state.UserName.trim() == "" || state.Password.trim() == "") {
			return setState({
				...state,
				Check: false,
			});
		}
		const data = {
			UserName: state.UserName,
			Password: state.Password,
		};
		const { error } = await login(data);
		if (error) {
			return setState({
				...state,
				Check: false,
			});
		}
		setState({ ...state, Check: true });

		try {
			const res = await api.post("/api/admin/login", data);
			setCookie("accessTokenAdmin", "beare " + res.data.accessToken);
			router.push("/");
		} catch (error) {
			setState({ ...state, Check: false });
		}
	};
	return (
		<div className='container mx-auto flex items-center justify-center'>
			<div className='flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10'>
				<div className='self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white'>Đăng nhập Admin</div>
				<div className='mt-8 space-y-4'>
					{!state.Check && <span className='font-semibold text-sm text-red-600'>Thông tin chưa chính xác </span>}
					<form onSubmit={handleLogin} autoComplete='off'>
						<div className='flex flex-col mb-2'>
							<div className='flex relative '>
								<span className='rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm'>
									<PersonCircle />
								</span>
								<input
									type='text'
									onChange={(e) => {
										setState({
											...state,
											Check: true,
											UserName: e.target.value,
										});
									}}
									value={state.UserName}
									className=' rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:border-primary'
									placeholder='UserName'
								/>
							</div>
						</div>
						<div className='flex flex-col mb-6'>
							<div className='flex relative '>
								<span className='rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm'>
									<Unlock />
								</span>
								<input
									type='password'
									onChange={(e) =>
										setState({
											...state,
											Check: true,
											Password: e.target.value,
										})
									}
									value={state.Password}
									className=' rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:border-primary'
									placeholder='Password'
								/>
							</div>
						</div>

						<div className='flex w-full'>
							<button type='submit' className='py-2 px-4  bg-primary hover:shadow-nextShadow  text-white w-full transition ease-in duration-200 text-center text-base font-semibold  rounded-full'>
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

const getLogin = async (accessToken) => {
	const data = {
		check: true,
		data: {},
	};
	try {
		const res = await api.post("/api/admin", { accessToken });
		data.data = res.data;
	} catch (error) {
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async (ctx) => {
	const cookies = new Cookies(ctx.req, ctx.res);
	const accessToken = cookies.get("accessTokenAdmin");
	if (!accessToken) {
		return {
			props: {
				admin: null,
			},
		};
	}
	const admin = await getLogin(accessToken);

	if (admin.check == false) {
		return {
			props: {
				admin: null,
			},
		};
	}

	return {
		redirect: {
			destination: "/",
			permanent: false,
		},
	};
};

export default Login;
Login.getLayout = (page) => page;
