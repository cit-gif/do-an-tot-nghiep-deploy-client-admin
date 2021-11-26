// import { useLocation } from 'react-router-dom';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import NavbarInput from '@material-tailwind/react/NavbarInput';
import Image from 'next/image';
import Dropdown from '@material-tailwind/react/Dropdown';
import DropdownItem from '@material-tailwind/react/DropdownItem';
import { XLg, List } from 'react-bootstrap-icons';
import { serverApi, qualityImage } from '@src/config/constrant';
import { useContext } from 'react';
import { AppContext } from '@src/context';
import { formatUrlForImage } from '@src/helper/formatHelper';
import Link from 'next/link';
import handleLogout from '@src/helper/handleLogout';
export default function AdminNavbar({ showSidebar, setShowSidebar, tagNameActive }) {
	// const location = useLocation().pathname;
	const { user } = useContext(AppContext);

	return (
		<nav className="bg-gray-800 md:ml-72 py-6 px-3">
			<div className="container max-w-full mx-auto flex items-center justify-between md:pr-8 md:pl-10">
				<div className="md:hidden">
					<Button
						color="transparent"
						buttonType="link"
						size="lg"
						iconOnly
						rounded
						ripple="light"
						onClick={() => setShowSidebar('left-0')}>
						<span className="text-2xl  text-white">
							<List />
						</span>
					</Button>
					<div
						className={`absolute top-2 md:hidden ${
							showSidebar === 'left-0' ? 'left-72' : '-left-72'
						} z-50 transition-all duration-300`}>
						<Button
							color="transparent"
							buttonType="link"
							size="lg"
							iconOnly
							rounded
							ripple="light"
							onClick={() => setShowSidebar('-left-72')}>
							<span className="text-2xl text-white">
								<XLg />
							</span>
						</Button>
					</div>
				</div>

				<div className="flex items-center justify-between w-full">
					<h4 className="uppercase text-white text-sm tracking-wider mt-1">{tagNameActive}</h4>

					<div className="relative inline-block">
						<Dropdown
							color="transparent"
							placement="bottom-start"
							buttonText={
								<div className="w-16 h-16 rounded-full overflow-hidden relative shadow">
									<Image
										src={formatUrlForImage(user.Avatar)}
										layout="fill"
										quality={qualityImage}
										objectFit="cover"
										loading="eager"
									/>
								</div>
							}
							className="block"
							buttonType="filled"
							size="regular"
							rounded={true}
							block={true}
							ripple="light"
							style={{
								padding: 0,
								color: 'transparent',
							}}>
							<DropdownItem color="cyan">
								<Link href="/trang-ca-nhan">
									<a>Trang cá nhân</a>
								</Link>
							</DropdownItem>
							<DropdownItem color="cyan">
								<a
									href="/"
									onClick={e => {
										e.preventDefault();
										handleLogout();
									}}>
									Đăng xuất
								</a>
							</DropdownItem>
						</Dropdown>
					</div>
				</div>
			</div>
		</nav>
	);
}
