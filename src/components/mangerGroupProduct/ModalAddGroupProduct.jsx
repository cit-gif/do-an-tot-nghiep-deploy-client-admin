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
import dynamic from "next/dynamic";


const Editor = dynamic(() => import("../QuillEditor"), {
	ssr: false
});
const ModalAddGroupProduct = (props) => {
	const { showModal, setShowModal, setDataTable } = props;
	const { enqueueSnackbar } = useSnackbar();
	const setDefault = () => {
		setInputGroupName("");
		setShowModal(false);
	};
	const [inputGroupName, setInputGroupName] = useState("");
	const [brands, setBrands] = useState([]);
	const [brandValue, setBrandValue] = useState({ value: "", label: "" });
	const [typeValue, setTypeValue] = useState("phone");

	const handleSubmit = async () => {

		if (inputGroupName === "") return enqueueSnackbar("Vui lòng nhập tên nhóm", { variant: "warning" });
		const accessTokenAdmin = cookieCutter.get("accessTokenAdmin");
		if (!accessTokenAdmin || accessTokenAdmin == "") {
			enqueueSnackbar("Bạn cần đăng nhập lại!", { variant: "error" });
			return router.push("/login");
		}
		//submit
		try {
			const newGroupProduct = { GroupName: inputGroupName, Brand: brandValue.value, ProductType: typeValue, Describe: editorContent }
			const res = await api.post(
				"/api/admin/addGroupProduct",
				newGroupProduct,
				{
					headers: {
						"Content-Type": "application/json",
						authorization: accessTokenAdmin,
					},
				}
			);
			setDataTable((prev) => [{ ...res.data, BrandName: brandValue.label, CountProduct: 0 }, ...prev]);
			setDefault();
			enqueueSnackbar("Thêm thành công!", { variant: "success" });
		} catch (error) {
			setDefault();
			return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });
		}
	};

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
			setBrandValue({ value: res.data[0]?._id, label: res.data[0]?.BrandName });
		} catch (error) {
			console.log(error.message);
		}
	};
	const buttonDisabled = inputGroupName === "";
	const [editorContent, setEditorContent] = useState({
		deltaOps: {},
		html: ""
	});
	return (
		<Modal size='lg' active={showModal} toggler={() => setShowModal(false)}>
			<ModalHeader toggler={() => setShowModal(false)}>
				<div className='my-6'>Thêm nhóm sản phẩm</div>
			</ModalHeader>
			<ModalBody>
				<div className='flex flex-col space-y-4'>
					<Input outline={true} size='sm' type='text' color='cyan' placeholder='Tên thương hiệu' value={inputGroupName} onChange={(e) => setInputGroupName(e.target.value)} />
					<label className='text-gray-700 mb-2' htmlFor='choicebrand'>
						Loại sản phẩm
						<select id='choicebrand' value={typeValue} onChange={(e) => setTypeValue(e.target.value)} className='block w-52 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'>
							<option value='phone'>phone</option>
							<option value='tablet'>tablet</option>
						</select>
					</label>
					<label className='text-gray-700 mb-2' htmlFor='choicebrand'>
						Thương hiệu
						<select id='choicebrand'
							onChange={(e) => {
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
					<Editor editorContent={editorContent} setEditorContent={setEditorContent} />
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
					Thêm
				</Button>
			</ModalFooter>
		</Modal>
	);
};

ModalAddGroupProduct.propTypes = {
	showModal: PropTypes.bool.isRequired,
	setShowModal: PropTypes.func.isRequired,
	setDataTable: PropTypes.func.isRequired,
};

export default ModalAddGroupProduct;
