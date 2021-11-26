import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";

function ModalDeleteMessage(props) {
	const { showModal, setShowModal, handleDelete } = props;

	return (
		<Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
			<ModalHeader toggler={() => setShowModal(false)}>Xóa toàn bộ cuộc trò chuyện này</ModalHeader>
			<ModalBody>
				<p className='text-base leading-relaxed text-red-700 font-normal'>Thao tác này không thể hoàn tác</p>
			</ModalBody>
			<ModalFooter>
				<Button
					color='cyan'
					onClick={(e) => {
						handleDelete();
						setShowModal(false);
					}}
					ripple='light'
				>
					Xác nhận
				</Button>
				<Button onClick={(e) => setShowModal(false)} color='blueGray' buttonType='link' ripple='dark'>
					Hủy bỏ
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default ModalDeleteMessage;
