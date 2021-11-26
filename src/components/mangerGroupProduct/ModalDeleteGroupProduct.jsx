import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import cookieCutter from "cookie-cutter";
import { useSnackbar } from "notistack";
import api from "@src/config/api";
import router from "next/router";




const ModalDeleteGroupProduct = (props) => {
      const { showModal, setShowModal, setDataTable, data } = props;
      const { enqueueSnackbar } = useSnackbar();
      const handleSubmit = async () => {
            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
                  return router.push("/login");
            }
            //submit
            try {

                  const res = await api.post(
                        "/api/admin/deleteGroupProduct",
                        { Id_GroupProduct: data._id },
                        {
                              headers: {
                                    "Content-Type": "application/json",
                                    authorization: accessTokenAdmin,
                              },
                        }
                  );

                  setDataTable((prev) => prev.filter((x) => x._id !== res.data.Id_GroupProduct));
                  enqueueSnackbar("Xóa nhóm sản phẩm thành công!", { variant: "success" });
            } catch (error) {

                  if (error?.response?.data) {
                        enqueueSnackbar(error.response.data.message, { variant: "error" });

                  } else {
                        enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });

                  }
            }
            setShowModal(false);
      };
      return (
            <Modal size='lg' active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        <div className='my-6'>Xóa nhóm sản phẩm này</div>
                  </ModalHeader>
                  <ModalBody>
                        <p className="text-base leading-relaxed text-red-700 font-medium">
                              Xóa nhóm sản phẩm: " {data.GroupName} ""
                        </p>
                        <p className="text-base leading-relaxed text-red-700 font-medium mt-2">
                              Cảnh báo: Hành động này không thể hoàn tác!
                        </p>
                  </ModalBody>
                  <ModalFooter>
                        <Button
                              color="red"
                              className="cursor-pointer"
                              onClick={handleSubmit}
                              ripple='light'
                        >
                              Xác nhận xóa
                        </Button>
                        <Button color='blueGray' buttonType='link' size='regular' rounded={false} block={false} iconOnly={false} ripple='dark' onClick={(e) => setShowModal(false)}>
                              Hủy bỏ
                        </Button>

                  </ModalFooter>
            </Modal>
      );
};

ModalDeleteGroupProduct.propTypes = {
      showModal: PropTypes.bool.isRequired,
      setShowModal: PropTypes.func.isRequired,
      setDataTable: PropTypes.func.isRequired,
      data: PropTypes.object.isRequired,
};

export default ModalDeleteGroupProduct;
