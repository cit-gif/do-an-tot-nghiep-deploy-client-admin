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
import Input from "@material-tailwind/react/Input";
import ProgressBar from "../common/ProgressBar";
import classNames from "classnames";
import Image from 'next/image';
import { serverApi, qualityImage } from "@src/config/constrant";
import Regex from "@src/helper/Regex";
const ModalEditBrand = ({ showModal, setShowModal, setDataTable, data }) => {
      // setState từ props
      const [inputBrandName, setInputBrandName] = useState("");
      useEffect(() => {
            setInputBrandName(data.BrandName)
      }, [data])
      //--end
      const { enqueueSnackbar } = useSnackbar();
      const [progressBarUpload, setProgressBarUpload] = useState({ show: false, value: 0 });
      const setDefault = () => {
            setChoiceImage({})
            setShowModal(false);
      }

      const handleSubmit = async () => {
            if (inputBrandName.trim() === "") return enqueueSnackbar("Vui lòng nhập tên thuong hiệu", { variant: "warning" });
            if (inputBrandName.trim() === data.BrandName) return enqueueSnackbar("Tên trùng với tên ban đầu", { variant: "warning" });

            if (!Regex.checkAZ_az_09(inputBrandName)) return enqueueSnackbar("Tên nhập vào không đúng định dạng", { variant: "error" });

            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
                  return router.push("/login");
            }
            //submit
            try {
                  const formData = new FormData();
                  if (choiceImage.file) {
                        formData.append("BrandImage", choiceImage.file);
                  };
                  formData.append("BrandName", inputBrandName);
                  formData.append("Id_Brand", data._id);

                  const res = await api.post("/api/admin/editbrand", formData, {
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

                  setDataTable(prev => prev.map(value => {
                        if (res.data._id === data._id) {
                              value.BrandName = res.data.BrandName,
                                    value.BrandImage = res.data.BrandImage;
                        }
                        return value;
                  }));
                  setDefault()
                  enqueueSnackbar("Thay đổi thành công!", { variant: "success" });
            } catch (error) {
                  setDefault();

                  if (error.response) {
                        return enqueueSnackbar(res.response.data.message, { variant: "error" });

                  }
                  return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });
            }
      };

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
      const buttonDisabled = inputBrandName === "";
      return (
            <Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        <div className='my-6'>Chỉnh sửa thương hiệu</div>
                  </ModalHeader>
                  <ModalBody>
                        <div className='mb-4 flex flex-col items-center justify-center'>
                              <Button className='mb-4' color='cyan' onClick={() => inputFileRef.current.click()} ripple='light'>
                                    Thay đổi hình ảnh
                              </Button>
                              {!choiceImage.file ? (
                                    <div className='relative w-32 h-8 rounded-full shadow-lg overflow-hidden'>
                                          <Image src={serverApi + data.BrandImage} alt={data.BrandName} layout='fill' objectFit="fill" quality={qualityImage} />
                                    </div>
                              ) : (
                                    <>
                                          <img className='mb-6 object-fill rounded-lg border shadow-lg align-middle w-32 h-8' src={choiceImage.previewImage} />
                                          <span className='text-sm'>{choiceImage.fileName}</span>
                                    </>
                              )}

                              <input onChange={handleChoiceFile} ref={inputFileRef} className='hidden invisible' type='file' accept='image/jpeg,image/png,image/jpg' />
                        </div>
                        <p className='my-4 text-sm text-gray-700'>Tên chỉ chứa chữ thường hoặc in hoặc số từ 0-9</p>
                        <Input value={inputBrandName} outline={true} size='sm' type='text' color='cyan' placeholder='Tên thương hiệu'
                              onChange={(e) =>
                                    setInputBrandName(e.target.value)
                              }
                        />
                        <div className='min-h-[1rem] w-full mt-2'>{progressBarUpload.show && <ProgressBar value={progressBarUpload.value} />}</div>
                  </ModalBody>
                  <ModalFooter>
                        <Button color='blueGray' buttonType='link' size='regular' rounded={false} block={false} iconOnly={false} ripple='dark' onClick={(e) => {
                              setDefault();
                              setShowModal(false);

                        }}>
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
                              Thay đổi
                        </Button>
                  </ModalFooter>
            </Modal>
      );

};

ModalEditBrand.propTypes = {
      showModal: PropTypes.bool.isRequired,
      setShowModal: PropTypes.func.isRequired,
      setDataTable: PropTypes.func.isRequired,
      data: PropTypes.object.isRequired,

};

export default ModalEditBrand;
