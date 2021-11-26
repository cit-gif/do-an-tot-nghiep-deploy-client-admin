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
export default function ModalDeleteUser(props) {
      const { showModal, setShowModal, data, setDataTable } = props;
      const { enqueueSnackbar } = useSnackbar()
      const handleDelete = async () => {
            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");

            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" })
                  return router.push("/login");
            }
            try {
                  const res = await api.post("/api/admin/deleteuser", {
                        _id: data._id
                        , accessToken: accessTokenAdmin
                  })
                  enqueueSnackbar('Xóa thành công!', { variant: "success" })
                  setDataTable((pre) => {
                        const countUsers = pre.metaData[0].countUsers - 1;
                        return { metaData: [{ ...pre.metaData[0], countUsers }], data: pre.data.filter(userObj => userObj._id != res.data._id) }
                  })
                  setShowModal(false)
            } catch (error) {
                  if (error.response) {
                        if (error.response.data.message == "Token không chính xác") {

                              router.push("/login");
                        }
                  }
                  enqueueSnackbar('Xóa không thành công!', { variant: "error" })

            }
      }

      return (
            <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        Xóa người dùng
                  </ModalHeader>
                  <ModalBody>
                        <p className="text-base leading-relaxed text-red-700 font-medium">
                              Xóa người dùng: {data.Name}
                        </p>
                        <p className="text-base leading-relaxed text-red-700 font-medium">
                              Cảnh báo: Hành động này không thể hoàn tác!
                        </p>
                  </ModalBody>
                  <ModalFooter>
                        <Button
                              color="red"
                              onClick={handleDelete}
                              ripple="light"
                        >
                              Xác nhận
                        </Button>
                        <Button
                              color="cyan"

                              onClick={(e) => setShowModal(false)}
                              ripple="dark"
                        >
                              Hủy bỏ
                        </Button>
                  </ModalFooter>
            </Modal>
      );
}