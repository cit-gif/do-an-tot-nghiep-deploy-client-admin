import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import cookieCutter from "cookie-cutter";
import { useSnackbar } from "notistack";
import api from "@src/config/api";
import router from "next/router";
import Input from "@material-tailwind/react/Input";
import ProgressBar from "../common/ProgressBar";
import classNames from "classnames";
import Regex from "@src/helper/Regex";

const ModalAddBrand = (props) => {
      const { showModal, setShowModal, setDataTable } = props;
      const { enqueueSnackbar } = useSnackbar();
      const [progressBarUpload, setProgressBarUpload] = useState({ show: false, value: 0 });
      const setDefault = () => {
            setChoiceImage({})
            setInputBrandName("");
            setShowModal(false);
      }
      const handleSubmit = async () => {
            if (inputBrandName === "") return enqueueSnackbar("Vui lòng nhập tên thuong hiệu", { variant: "warning" });
            if (!Regex.checkAZ_az_09(inputBrandName)) return enqueueSnackbar("Tên nhập vào không đúng định dạng", { variant: "error" });
            if (!choiceImage.file) return enqueueSnackbar("Ảnh chưa được chọn", { variant: "warning" });
            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
                  return router.push("/login");
            }
            //submit
            try {
                  const formData = new FormData();
                  formData.append("BrandImage", choiceImage.file);
                  formData.append("BrandName", inputBrandName.trim());

                  const res = await api.post("/api/admin/addbrand", formData, {
                        headers: {
                              "Content-Type": "multipart/form-data",
                              authorization: accessTokenAdmin,
                        },
                        onUploadProgress: (progressEvent) => {
                              let value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                              if (value < 100) {
                                    setProgressBarUpload({ show: true, value: value });

                                    return;
                              }
                              return setProgressBarUpload({ show: false, value: 0 });
                        },
                  });
                  setDataTable(prev => [...prev, res.data]);
                  setDefault()
                  enqueueSnackbar("Thêm thành công!", { variant: "success" });
            } catch (error) {
                  setDefault()
                  return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });
            }
      };
      const [inputBrandName, setInputBrandName] = useState("");
      const inputFileRef = useRef(null);
      const [choiceImage, setChoiceImage] = useState({});
      const handleChoiceFile = (e) => {
            if (e.target.files.length === 0) {
                  return;
            }
            const file = e.target.files[0];
            const fileName = file.name;
            const allowed_types = ["image/jpeg", "image/png", "image/jpg"];
            const allowed_size_mb = 2;
            if (allowed_types.indexOf(file.type) === -1) {
                  return enqueueSnackbar("Định dạng ảnh không được hỗ trợ!", { variant: "error" });
            }
            if (file.size > allowed_size_mb * 1024 * 1024) {
                  return enqueueSnackbar("Kích thước ảnh <= 2 MB!", { variant: "error" });
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                  setChoiceImage({
                        ...choiceImage,
                        previewImage: e.target.result,
                        fileName: fileName,
                        file: file,
                        check: true,
                  });
            };
      };
      const buttonDisabled = inputBrandName === "" || !choiceImage.check ? true : false;
      return (
            <Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        <div className='my-6'>Thêm thương hiệu</div>
                  </ModalHeader>
                  <ModalBody>
                        <div className='mb-4 flex flex-col items-center justify-center'>
                              <Button className='mb-4' color='cyan' onClick={() => inputFileRef.current.click()} ripple='light'>
                                    Chọn hình đại diện
                              </Button>
                              {!choiceImage.file ? (
                                    <span className='text-sm font-medium'>Ảnh chưa được chọn</span>
                              ) : (
                                    <>
                                          <img className='mb-6 object-fill rounded-lg border shadow-lg align-middle w-32 h-8' src={choiceImage.previewImage} />
                                          <span className='text-sm'>{choiceImage.fileName}</span>
                                    </>
                              )}

                              <input onChange={handleChoiceFile} ref={inputFileRef} className='hidden invisible' type='file' accept='image/jpeg,image/png,image/jpg' />
                        </div>
                        <p className='my-4 text-sm text-gray-700'>Tên chỉ chứa chữ thường hoặc in hoặc số từ 0-9</p>

                        <Input outline={true} size='sm' type='text' color='cyan' placeholder='Tên thương hiệu' value={inputBrandName} onChange={(e) => setInputBrandName(e.target.value)} />
                        <div className='min-h-[1rem] w-full mt-2'>{progressBarUpload.show && <ProgressBar value={progressBarUpload.value} />}</div>
                  </ModalBody>
                  <ModalFooter>
                        <Button color='blueGray' buttonType='link' size='regular' rounded={false} block={false} iconOnly={false} ripple='dark' onClick={(e) => setShowModal(false)}>
                              Hủy bỏ
                        </Button>
                        <Button color={buttonDisabled ? "blueGray" : "cyan"}
                              className={classNames({
                                    'cursor-pointer': !buttonDisabled,
                                    'cursor-not-allowed': buttonDisabled
                              })}
                              disabled={buttonDisabled}
                              onClick={handleSubmit}
                              ripple='light'>
                              Thêm
                        </Button>
                  </ModalFooter>
            </Modal>
      );
};

ModalAddBrand.propTypes = {
      showModal: PropTypes.bool.isRequired,
      setShowModal: PropTypes.func.isRequired,
      setDataTable: PropTypes.func.isRequired,
};

export default ModalAddBrand;
