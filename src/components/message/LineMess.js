import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";
import { useRef } from "react";
import FormatDate from "@src/helper/FormatDate";
import Image from "next/image";
import { qualityImage, serverApi } from "@src/config/constrant";
function LineMess(props) {
	const { From_Id_User, MessengerContent, Time, Name, Avatar, Role } = props.data;
	const myRole = "admin";
	const messRef = useRef();
	return (
		<div className='w-full my-4 px-2'>
			{myRole != Role ? (
				<div className='w-full flex items-center'>
					<div className='w-8/12 flex items-center '>
						<div className='w-12 h-12  flex justify-center items-center bg-gray-600 shadow rounded-full overflow-hidden relative border mr-2 cursor-pointer'>
							<span className='text-white text-xs font-medium'>{Name.trim().split(" ").pop()}</span>
							{Avatar && Avatar !== "" && <Image src={serverApi + Avatar} alt={Name.trim().split(" ").pop()} qualit={qualityImage} layout='fill' objectFit='cover' />}
						</div>
						<div className='max-w-[calc(100%-3.5rem)] rounded-2xl px-3 py-2 flex bg-gray-500 text-gray-100 text-[.95rem]' ref={messRef}>
							<span>{MessengerContent}</span>
						</div>
						<Tooltips placement='right' ref={messRef}>
							<TooltipsContent>
								<span className='text-xs'>{FormatDate(Time)}</span>
							</TooltipsContent>
						</Tooltips>
					</div>
				</div>
			) : (
				<div className='w-full flex items-center justify-end'>
					<div className='w-8/12 flex items-center justify-end'>
						<div ref={messRef} className='flex bg-primary text-white text-[.95rem] space-x-2 rounded-2xl py-1 px-3'>
							<span>{MessengerContent}</span>
						</div>
						<Tooltips placement='left' ref={messRef}>
							<TooltipsContent>
								<span className='text-xs'>{FormatDate(Time)}</span>
							</TooltipsContent>
						</Tooltips>
					</div>
				</div>
			)}
		</div>
	);
}

export default LineMess;
