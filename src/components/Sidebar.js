import { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import H6 from '@material-tailwind/react/Heading6';
import Link from 'next/link';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { clientDomain } from '@src/config/constrant';
import { BiHomeAlt } from 'react-icons/bi';
export default function Sidebar(props) {
	const { tags, tagActiviti, setTagActiviti } = props;
	const [showSidebar, setShowSidebar] = useState('-left-72');
	return (
		<>
			<AdminNavbar
				showSidebar={showSidebar}
				setShowSidebar={setShowSidebar}
				tagNameActive={tags[tagActiviti].name}
			/>
			<div
				className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-72 z-10 py-4 px-3 transition-all duration-300`}>
				<div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
					<div className="mt-2 text-center w-full inline-block">
						<H6 color="gray">Admin Phone X</H6>
					</div>
					<div className="flex flex-col">
						<hr className="my-4 min-w-full" />

						<ul className="flex-col min-w-full flex list-none text-gray-800 font-medium text-base">
							{tags.map((tag, key) => (
								<li className="rounded-lg mb-4" key={key}>
									<Link href={tag.href}>
										<a
											onClick={e => {
												setTagActiviti(key);
											}}
											className={`cursor-pointer transition-all select-none flex items-center gap-4 px-4 py-3 rounded-lg ${
												key === tagActiviti
													? 'bg-primary font-bold text-white shadow-md'
													: ' bg-gray-100'
											}`}>
											<span className="text-2xl">{tag.icon}</span>
											{tag.name}
										</a>
									</Link>
								</li>
							))}

							<li className="rounded-lg mb-2 text-gray-700 hover:underline">
								<a
									href={clientDomain}
									target="_blank"
									className="cursor-pointer transition-all select-none flex items-center gap-4 px-4 py-3 rounded-lg bg-gray-100">
									<span className="text-2xl">
										<BiHomeAlt />
									</span>
									Đi đến trang người dùng
								</a>
							</li>
						</ul>

						<ul className="flex-col min-w-full flex list-none">
							<li className="bg-gray-500 px-4 rounded-lg text-white mb-2">
								<Link href="/login">
									<a
										title="Đăng xuất"
										className="flex items-center gap-4 text-sm font-light py-3">
										<span className="text-2xl font-medium">
											<BoxArrowLeft />
										</span>
										Đăng xuất
									</a>
								</Link>
							</li>
							{/* <li className='bg-gradient-to-tr from-purple-500 to-purple-700 px-4 rounded-lg text-white'>
								<a href='https://www.creative-tim.com/product/material-tailwind-dashboard-react' target='_blank' rel='noreferrer' className='flex items-center justify-center gap-4 text-sm font-light py-3'>
									Free Download
								</a>
							</li> */}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
