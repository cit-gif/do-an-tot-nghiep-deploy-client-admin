import { ThreeDots } from "react-bootstrap-icons";
import Popover from "@material-tailwind/react/Popover";
import PopoverContainer from "@material-tailwind/react/PopoverContainer";
import PopoverHeader from "@material-tailwind/react/PopoverHeader";
import PopoverBody from "@material-tailwind/react/PopoverBody";
import { useRef, useState } from "react";
import FormatDate from "@src/helper/FormatDate";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";
import ModalDeleteMessage from "./ModalDeleteMessage";
const formatMess = (str = "") => {
	const arrayFromString = str.split(" ").slice(0, 6);
	if (arrayFromString.length <= 8) {
		return arrayFromString.join(" ");
	}
	return arrayFromString.join(" ") + "...";
};
function SlidesMessItem(props) {
	const { userFocus, Avatar, _id = "", Name = "", Message, LastTimeActive = "" } = props.data;
	const onClick = props.onClick || function () {};
	const handleDelete = props.handleDelete || function () {};
	const options = useRef();
	const [showOptions, setShowOptions] = useState(false);
	const lineRef = useRef();
	const [showModalDeleteMessage, setShowModalDeleteMessage] = useState(false);

	return (
		<>
			<li ref={lineRef} className='w-full relative' onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
				<div onClick={onClick} className='space-x-2 flex w-full py-2 px-2 rounded-lg  transition-all hover:bg-gray-200 cursor-pointer'>
					<div title={Name} className={`relative w-12 h-12 bg-primary min-w-[3rem] rounded-full border `}>
						{LastTimeActive === "Đang hoạt động" ? (
							<div className={` bottom-1 right-1 absolute w-2 h-2 rounded-full  bg-green-700 z-[10]`}>
								<span className='absolute inset-0 rounded-full bg-green-700 w-full h-full animate-ping' />
							</div>
						) : (
							""
						)}

						<div className='relative w-full h-full rounded-full overflow-hidden flex items-center justify-center'>
							<span className='text-sm text-white'>{Name.trim().split(" ").pop()}</span>
							{Avatar !== "" && <Image src={serverApi + Avatar} alt={Name.trim().split(" ").pop()} quality={qualityImage} objectFit='cover' layout='fill' />}
						</div>
					</div>
					<div>
						<span className='text-sm font-medium'>{Name}</span>
						<div className='flex flex-col'>
							<div className='h-4 flex items-center'>
								{userFocus ? (
									<div className='flex-grow px-10 relative flex items-end py-1  w-full'>
										<div className='dot-falling' />
									</div>
								) : (
									<small className='mr-2 truncate'>{Message ? formatMess(Message.MessengerContent) : ""}</small>
								)}
							</div>

							<small>{Message && Message?.Time !== "" ? FormatDate(Message.Time) : ""}</small>
						</div>
					</div>
				</div>

				{showOptions && (
					<div className='absolute top-1/2 -translate-y-1/2  right-1/4 z-[1] inline cursor-pointer'>
						<div ref={options} className='w-8 h-8 rounded-full bg-white hover:bg-gray-200 border transition-all flex items-center justify-center'>
							<ThreeDots />
						</div>
						<Popover placement='bottom' ref={options}>
							<PopoverContainer className='shadow-xl'>
								<div onClick={() => setShowModalDeleteMessage(true)} className='min-w-[10rem] cursor-pointer select-none bg-gray-100 hover:bg-gray-700 transition-all shadow-dropdownAbsolute rounded-xl text-xs text-gray-900 hover:text-white font-medium py-2 px-2'>
									Xóa toàn bộ cuộc trò chuyện
								</div>
							</PopoverContainer>
						</Popover>
					</div>
				)}
				<ModalDeleteMessage
					handleDelete={() => {
						handleDelete(_id);
					}}
					showModal={showModalDeleteMessage}
					setShowModal={setShowModalDeleteMessage}
				/>
			</li>
			{/* {LastTimeActive !== "Đang hoạt động" && (
				<Tooltips placement='top' ref={lineRef}>
					<TooltipsContent>
						<span className='text-xs'>{LastTimeActive === "Đang hoạt động" ? LastTimeActive : "Hoạt động lần cuối: " + FormatDate(LastTimeActive)}</span>
					</TooltipsContent>
				</Tooltips>
			)} */}
		</>
	);
}

export default SlidesMessItem;
