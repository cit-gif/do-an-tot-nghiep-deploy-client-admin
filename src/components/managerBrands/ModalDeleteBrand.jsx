import PropTypes from "prop-types";
import React, { useState } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import cookieCutter from "cookie-cutter";
import { useSnackbar } from "notistack";
import api from "@src/config/api";
import router from "next/router";

const ModalDeleteBrand = (props) => {
	const { showModal, setShowModal, data, setDataTable } = props;
	const { enqueueSnackbar } = useSnackbar();
	const handleDelete = async () => {
		const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");

		if (!accessTokenAdmin || accessTokenAdmin == "") {
			enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
			return router.push("/login");
		}
		try {
			const res = await api.post("/api/admin/deletebrand", {
				Id_Brand: data._id,
				accessToken: accessTokenAdmin,
			});

			enqueueSnackbar(`Đã xóa ${res.data.CountBrandsDeleted} thương hiệu, ${res.data.CountProductsDeleted} sản phẩm trong ${res.data.CountGroupsProductDeleted} thương hiệu và ${res.data.CountImagesDeleted} hình ảnh có liên quan.`, { variant: "success", autoHideDuration: 5000 });
			setDataTable((pre) => pre.filter((x) => x._id !== data._id));
			setShowModal(false);
		} catch (error) {
			if (error.response) {
				if (error.response.data.message == "Token không chính xác") {
					router.push("/login");
				}
			}
			enqueueSnackbar("Xóa không thành công!", { variant: "error" });
		}
	};

	return (
		<Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
			<ModalHeader toggler={() => setShowModal(false)}>Xóa thương hiệu</ModalHeader>
			<ModalBody>
				<p className='text-base leading-relaxed text-red-700 font-medium'>Xóa thương hiệu: {data.BrandName}</p>
				<p className='text-base leading-relaxed text-red-700 font-medium'>Việc xóa thương hiệu này cũng sẽ xóa tất cả nhóm sản phẩm và sản phẩm trong thương hiệu đó và đồng thời xóa tất cả các hình ảnh liên quan!</p>
				<p className='text-base leading-relaxed text-red-700 font-medium'>Cảnh báo: Hành động này không thể hoàn tác!</p>
			</ModalBody>
			<ModalFooter>
				<Button color='red' onClick={handleDelete} ripple='light'>
					Xác nhận
				</Button>
				<Button color='blueGray' onClick={(e) => setShowModal(false)} ripple='dark'>
					Hủy bỏ
				</Button>
			</ModalFooter>
		</Modal>
	);
};

ModalDeleteBrand.propTypes = {
	showModal: PropTypes.bool.isRequired,
	setShowModal: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	setDataTable: PropTypes.func.isRequired,
};

export default ModalDeleteBrand;
