import { Modal, Descriptions, Button, Typography } from 'antd';
import { serverApi, qualityImage, clientDomain } from '@src/config/constrant';
import Image from 'next/image';
import Link from 'next/link';
function ModalDetailProduct(props) {
	const { show, data } = props.state;

	const setState = props.setState;
	const handleCancel = () => {
		setState(pre => ({
			...pre,
			show: false,
		}));
	};
	if (Object.keys(data).length === 0) return '';

	return (
		<Modal
			footer={[
				<Button key="back" onClick={handleCancel}>
					Đóng
				</Button>,
			]}
			visible={show}
			onCancel={handleCancel}
			title="Chi tiết sản phẩm">
			<div className="relative w-16 h-16 mx-auto">
				<Image
					src={`${serverApi}${data.Information.DisplayImage}`}
					layout="fill"
					objectFit="cover"
					quality={qualityImage}
				/>
			</div>
			<Link href={`${clientDomain}/${data.Path}`}>
				<a
					target="_blank"
					className="text-base font-medium hover:underline my-2 block text-center text-primaryDark">
					Đến trang sản phẩm
				</a>
			</Link>
			<Descriptions title={data.ProductName} bordered layout="horizontal" size="middle" column={1}>
				<Descriptions.Item label="Tên sản phẩm">{data.ProductName}</Descriptions.Item>
				<Descriptions.Item label="Thuộc nhóm sản phẩm">{data.GroupName}</Descriptions.Item>
				<Descriptions.Item label="Ngày tạo">{data.createdAt}</Descriptions.Item>
				<Descriptions.Item label="Giá bán ra">{data.Information.Price}</Descriptions.Item>
				<Descriptions.Item label="Giá khuyến mại">{data.Information.PriceSale}</Descriptions.Item>
				<Descriptions.Item label="Số lượng trong kho">
					{data.Information.RemainingAmount}
				</Descriptions.Item>
				<Descriptions.Item label="Số lượt xem">{data.Views}</Descriptions.Item>
				<Descriptions.Item label="Sao đánh giá">{data.Star}</Descriptions.Item>
				<Descriptions.Item label="Số đánh giá">{data.CountEvaluate}</Descriptions.Item>
				<Descriptions.Item label="Số bình luận">{data.CountComment}</Descriptions.Item>
			</Descriptions>
			{/* <Typography.Title level={5}>Cấu hình</Typography.Title> */}
			<Descriptions title="Cấu hình" bordered layout="horizontal" size="middle" column={1}>
				{data.Information.Configuration.map((item, key) => {
					const [[keyObj, valueObj]] = Object.entries(item);
					return (
						<Descriptions.Item key={key} label={keyObj}>
							{valueObj}
						</Descriptions.Item>
					);
				})}
			</Descriptions>
		</Modal>
	);
}

export default ModalDetailProduct;
