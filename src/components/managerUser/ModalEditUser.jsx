import React, { useState } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Input from '@material-tailwind/react/Input';
import { useSnackbar } from "notistack";
import api from "@src/config/api";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
export default function ModalEditUser(props) {
      const { showModal, setShowModal, data, setDataTable } = props;
      const { enqueueSnackbar } = useSnackbar()
      const [edit, setEdit] = useState({
            Name: data.Name,
            PhoneNumber: data.PhoneNumber,
            Address: {
                  City: data.Address.City,
                  District: data.Address.District,
                  Wards: data.Address.Wards,
                  Details: data.Address.Details,

            },
            Password: "",

      })
      const router = useRouter()
      const handleEdit = async () => {
            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");

            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" })
                  return router.push("/login");
            }
            try {
                  const dataRequest = {
                        ...edit,
                        _id: data._id,
                        accessToken: accessTokenAdmin
                  }
                  const res = await api.post("/api/admin/edituser", dataRequest)
                  enqueueSnackbar('Chỉnh sửa thành công!', { variant: "success" })
                  setDataTable((pre) => {
                        const newData = pre.data;
                        const indexFind = pre.data.findIndex((x) => x._id === data._id);
                        if (indexFind !== -1) {
                              newData[indexFind] = res.data
                              return { ...pre, data: newData };
                        }
                        window.location.reload();
                        return pre;
                  })
                  setShowModal(false)
            } catch (error) {
                  if (error.response) {
                        if (error.response.data.message == "Token không chính xác") {
                              router.push("/login");
                        }
                  }
                  enqueueSnackbar('Chỉnh sửa không thành công!', { variant: "error" })
            }
      }


      return (
            <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        Chỉnh sửa người dùng
                  </ModalHeader>
                  <ModalBody>

                        <h6 className="text-primary text-sm mt-3 mb-6 font-light uppercase">
                              {data.Name}
                        </h6>
                        <div className="flex flex-wrap mt-10">
                              <div className="w-full mb-10 font-light">
                                    <Input

                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Tên"
                                          value={edit.Name}
                                          onChange={(e) => setEdit({ ...edit, Name: e.target.value })}
                                    />
                              </div>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Số điện thoại"
                                          value={edit.PhoneNumber}
                                          onChange={(e) => setEdit({ ...edit, PhoneNumber: e.target.value })}

                                    />
                              </div>
                              <p className="text-primary text-sm mt-3 mb-6 font-light uppercase">
                                    Địa chỉ
                              </p>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Tỉnh/Thành Phố"
                                          value={edit.Address.City}
                                          onChange={(e) => setEdit({ ...edit, Address: { ...edit.Address, City: e.target.value } })}
                                    />
                              </div>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Quận/Huyện"
                                          value={edit.Address.District}
                                          onChange={(e) => setEdit({ ...edit, Address: { ...edit.Address, District: e.target.value } })}
                                    />
                              </div>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Xã/Thị trấn"
                                          value={edit.Address.Wards}
                                          onChange={(e) => setEdit({ ...edit, Address: { ...edit.Address, Wards: e.target.value } })}
                                    />
                              </div>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Chi tiêt"
                                          value={edit.Address.Details}
                                          onChange={(e) => setEdit({ ...edit, Address: { ...edit.Address, Details: e.target.value } })}
                                    />
                              </div>
                              <p className="text-primary text-sm mt-3 mb-6 font-light uppercase">
                                    Đổi mật khẩu
                              </p>
                              <div className="w-full mb-10 font-light">
                                    <Input
                                          outline={true}
                                          size="sm"
                                          type="text"
                                          color="cyan"
                                          placeholder="Mật khẩu"
                                          value={edit.Password}
                                          onChange={(e) => setEdit({ ...edit, Password: e.target.value })}
                                    />
                              </div>
                        </div>
                  </ModalBody>
                  <ModalFooter>
                        <Button
                              color="blueGray"
                              buttonType="filled"
                              size="regular"
                              rounded={false}
                              block={false}
                              iconOnly={false}
                              ripple="light"
                              onClick={(e) => setShowModal(false)}
                        >
                              Hủy bỏ
                        </Button>

                        <Button
                              color="cyan"
                              onClick={handleEdit}
                              ripple="light"
                        >
                              Thay đổi
                        </Button>
                  </ModalFooter>
            </Modal>
      );
}