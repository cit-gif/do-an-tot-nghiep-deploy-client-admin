import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useProductContext } from '../managerProductContext';
import { managerProductActions } from '../managerProductSlice';
import EditConfiguration from './EditConfiguration';
import EditDisplayImage from './EditDisplayImage';
import EditInformation from './EditInformation';
import EditListImage from './EditListImage';
function ModalEditProduct() {
	const { setModalEditUrlDisplayImage, setModalEditFileDisplayImage } = useProductContext();
	const dispatch = useDispatch();
	const handleCancel = () => {
		// đòng modal
		dispatch(managerProductActions.hiddenModalEditProduct());
		// khi đóng modal thì xóa file image đã chọn để tránh khi người dùng chọn sản phẩm
		// khác mà chưa sửa hình ảnh thì đã hiển thị hình ảnh
		setModalEditUrlDisplayImage(null);
		setModalEditFileDisplayImage(null);
	};
	const show = useSelector(state => state.managerProduct.modalEditProduct.show);
	return (
		<Modal
			width={1000}
			style={{ maxWidth: '100%' }}
			footer={[
				<Button key="close" onClick={handleCancel}>
					Đóng
				</Button>,
			]}
			visible={show}
			onCancel={handleCancel}
			title="Chỉnh sửa sản phẩm">
			{/* chỉnh sửa hình ảnh */}
			<EditDisplayImage />
			{/*  chỉnh sửa thông tin */}
			<EditInformation />
			{/* Chỉnh sủa cấu hình */}
			<EditConfiguration />
			{/*chỉnh sưa danh sách hình ảnh */}
			<EditListImage />
		</Modal>
	);
}

export default ModalEditProduct;
