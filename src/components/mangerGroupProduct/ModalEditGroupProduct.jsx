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
import Regex from "@src/helper/Regex";
import axios from "axios";
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import("../QuillEditor"), {
      ssr: false
});



const ModalEditGroupProduct = (props) => {
      const { showModal, setShowModal, setDataTable, data } = props;
      const { enqueueSnackbar } = useSnackbar();
      const setDefault = () => {
            setInputGroupName("");
            setShowModal(false);
            setBrandValue({ value: "", label: "" });
            setEditorContent(null)

      };
      const [editorContent, setEditorContent] = useState({
            deltaOps: {},
            html: ""
      });
      const [editorContentDefault, setEditorContentDefault] = useState(null);
      const [brands, setBrands] = useState([]);
      const [brandValue, setBrandValue] = useState({ value: "", label: "" });
      const [inputGroupName, setInputGroupName] = useState(data.GroupName);
      const [typeValue, setTypeValue] = useState();
      const [loadedBrands, setLoadedBrands] = useState(false);

      useEffect(() => {
            if (!loadedBrands) return;
            setBrandValue({ value: data.Id_Brand, label: data.BrandName });
      }, [data])
      useEffect(() => {
            const cancelTokenSource = axios.CancelToken.source();
            getBrands(cancelTokenSource);
            return () => {
                  cancelTokenSource.cancel();
            };
      }, []);
      const getBrands = async (cancelTokenSource) => {

            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  return router.push("/login");
            }
            try {
                  const res = await api.get("/api/admin/getbrands", {

                        headers: { "Content-Type": "application/json", authorization: accessTokenAdmin },
                        cancelToken: cancelTokenSource.token,
                  });
                  setBrands(res.data);
                  setLoadedBrands(true);
            } catch (error) {
                  // console.log(error.message);
            }
      };
      useEffect(() => {
            // console.log(data); return
            setInputGroupName(data.GroupName);
            setTypeValue(data.ProductType);


      }, [data])
      useEffect(() => {
            if (data._id === '') return;
            const cancelTokenSource = axios.CancelToken.source();
            const getEditor = async (cancelTokenSource) => {
                  const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
                  if (!accessTokenAdmin || accessTokenAdmin == "") {
                        return router.push("/login");
                  }
                  try {
                        const res = await api.get("/api/admin/getEditor/" + data._id, {
                              headers: { "Content-Type": "application/json", authorization: accessTokenAdmin },
                              cancelToken: cancelTokenSource.token,
                        });

                        if (res.data?.Describe?.deltaOps) {
                              setEditorContentDefault(res.data.Describe.deltaOps);
                        } else {
                              setEditorContentDefault({})
                        }
                  } catch (error) {
                        enqueueSnackbar('get editorContent không thành công!', { variant: "error" })
                        // console.log(error.message);
                  }
            };
            getEditor(cancelTokenSource);
            return () => {
                  cancelTokenSource.cancel();
            };
      }, [data]);




      const handleSubmit = async () => {


            if (inputGroupName === "") return enqueueSnackbar("Vui lòng nhập tên nhóm", { variant: "warning" });
            const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
            if (!accessTokenAdmin || accessTokenAdmin == "") {
                  enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
                  return router.push("/login");
            }
            //submit
            try {


                  const res = await api.post(
                        "/api/admin/editGroupProduct",
                        { Id_GroupProduct: data._id, GroupName: inputGroupName, Brand: brandValue.value, ProductType: typeValue, Describe: editorContent },
                        {
                              headers: {
                                    "Content-Type": "application/json",
                                    authorization: accessTokenAdmin,
                              },
                        }
                  );
                  setDataTable((prev) => prev.map(item => {
                        if (item._id === res.data._id) return ({
                              ...item,
                              BrandName: brandValue.label,
                              GroupName: inputGroupName,
                              Id_Brand: brandValue.value,
                              ProductType: typeValue,

                        })
                        return item;
                  }));

                  enqueueSnackbar("Thay đổi thành công!", { variant: "success" });
            } catch (error) {
                  enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });
            }
            setDefault();

      };



      const buttonDisabled = inputGroupName === "";
      return (
            <Modal size='lg' active={showModal} toggler={() => setShowModal(false)}>
                  <ModalHeader toggler={() => setShowModal(false)}>
                        <div className='my-6'>Chỉnh sửa nhóm sản phẩm</div>
                  </ModalHeader>
                  <ModalBody>
                        <div className='flex flex-col space-y-4 relative'>
                              <Input outline={true} size='sm' type='text' color='cyan' placeholder='Tên thương hiệu' value={inputGroupName} onChange={(e) => setInputGroupName(e.target.value)} />
                              <label className='text-gray-700 mb-2' htmlFor='choiceEditProductType'>
                                    Loại sản phẩm
                                    <select id='choiceEditProductType' value={typeValue} onChange={(e) => setTypeValue(e.target.value)} className='block w-52 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'>
                                          <option value='phone'>phone</option>
                                          <option value='tablet'>tablet</option>
                                    </select>
                              </label>
                              <label className='text-gray-700 mb-2' htmlFor='choiceEditBrand'>
                                    Thương hiệu
                                    <select id="choiceEditBrand" onChange={(e) => {
                                          const optionIndex = e.target.options.selectedIndex;
                                          setBrandValue({ value: brands[optionIndex]._id, label: brands[optionIndex].BrandName })
                                    }} value={brandValue.value} className='block w-52 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'>
                                          {brands.map((item, key) => (
                                                <option key={key} value={item._id}>
                                                      {item.BrandName}
                                                </option>
                                          ))}
                                    </select>
                              </label>
                              <Editor editorContent={editorContent} setEditorContent={setEditorContent} editorContentDefault={editorContentDefault} />
                        </div>

                  </ModalBody>
                  <ModalFooter>
                        <Button color='blueGray' buttonType='link' size='regular' rounded={false} block={false} iconOnly={false} ripple='dark' onClick={(e) => setShowModal(false)}>
                              Hủy bỏ
                        </Button>
                        <Button
                              color={buttonDisabled ? "blueGray" : "cyan"}
                              className={classNames({
                                    "cursor-pointer": !buttonDisabled,
                                    "cursor-not-allowed": buttonDisabled,
                              })}
                              disabled={buttonDisabled}
                              onClick={handleSubmit}
                              ripple='light'
                        >
                              Thay đổi
                        </Button>
                  </ModalFooter>
            </Modal>
      );
};

ModalEditGroupProduct.propTypes = {
      showModal: PropTypes.bool.isRequired,
      setShowModal: PropTypes.func.isRequired,
      setDataTable: PropTypes.func.isRequired,
};

export default ModalEditGroupProduct;
