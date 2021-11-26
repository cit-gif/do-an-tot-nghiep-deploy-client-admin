import { createSlice, createSelector } from '@reduxjs/toolkit';
const initialState = {
	modalEditProduct: {
		data: {
			_id: '',
			Brand: {
				Id_Brand: '',
				BrandName: '',
				BrandImage: '',
			},
			GroupName: '',
			ProductType: '',
			createdAt: '',
			ProductName: '',
			Path: '',
			Information: {
				Configuration: [],
				DisplayImage: '',
				Price: 0,
				PriceSale: 0,
				RemainingAmount: 0,
			},
			Image: [],
			Id_Product: '',
			CountEvaluate: 0,
			CountComment: 0,
			Views: 0,
			ProductSold: 0,
			Star: 0,
		},

		show: false,
	},
	modalAddProduct: {
		show: false,
	},
	dataTable: {
		data: [],
		metaData: [],
	},
	groupProductOption: [], // lựa chọn thây đổi nhóm sản phẩm
};
export const managerProductSlice = createSlice({
	name: 'managerProductSlice',
	initialState: initialState,
	reducers: {
		setDataOfDataTable(state, action) {
			// danh sách sản phẩm
			state.dataTable.data = action.payload;
		},
		setMetaOfDataTable(state, action) {
			// meta danh sách sản phẩm
			state.dataTable.metaData = action.payload;
		},
		updateDisplayImageForOneProduct(state, action) {
			// cập nhập lại hình ảnh cho 1 sản phẩm
			const { Id_Product, newImageUrl } = action.payload;
			const oldData = state.dataTable.data;
			state.dataTable.data = oldData.map(item => {
				if (item.Id_Product == Id_Product) {
					return {
						...item,
						Information: {
							...item.Information,
							DisplayImage: newImageUrl,
						},
					};
				}
				return item;
			});
		},
		// cập nhạt lại thông tin cho 1 sản phẩm

		updateInformationForOneProduct(state, action) {
			const { Id_Product, ProductName, Price, PriceSale, RemainingAmount } = action.payload;
			state.dataTable.data = state.dataTable.data.map(item => {
				if (item.Id_Product == Id_Product) {
					return {
						...item,
						ProductName,
						Information: {
							...item.Information,
							Price,
							PriceSale,
							RemainingAmount,
						},
					};
				}
				return item;
			});
		},
		// ẩn/ hiển modal chỉnh sửa
		showModalEditProduct(state) {
			state.modalEditProduct.show = true;
		},
		hiddenModalEditProduct(state) {
			state.modalEditProduct.show = false;
		},

		setDataModalEditProduct(state, action) {
			state.modalEditProduct.data = action.payload;
		},
		setGroupProductOption(state, action) {
			state.groupProductOption = action.payload;
		},

		setDisplayImageForData(state, action) {
			state.modalEditProduct.data.Information.DisplayImage = action.payload;
		},
		//update têm sản phẩm cho modal edit
		setProductNameForModalEdit(state, action) {
			state.modalEditProduct.data.ProductName = action.payload;
		},
		// cập nhật giá sản phẩm
		setPriceForModalEdit(state, action) {
			state.modalEditProduct.data.Information.Price = action.payload;
		},
		// cập nhật giá khuyến mại sản phẩm
		setPriceSaleForModalEdit(state, action) {
			state.modalEditProduct.data.Information.PriceSale = action.payload;
		},
		// cập nhật giá khuyến mại sản phẩm
		setRemainingAmountForModalEdit(state, action) {
			state.modalEditProduct.data.Information.RemainingAmount = action.payload;
		},
		//thêm thông tin configuration
		addConfiguration(state, action) {
			state.modalEditProduct.data.Information.Configuration.push(action.payload);
		},
		//xóa thông tin configuration
		deleteConfiguration(state, action) {
			//key của obj
			const keyObj = action.payload;
			const arrConfig = state.modalEditProduct.data.Information.Configuration;
			state.modalEditProduct.data.Information.Configuration = arrConfig.filter(item => {
				const keyItem = Object.keys(item);
				return !keyItem.includes(keyObj);
			});
		},
		//cập nhật thông tin configuration
		editConfiguration(state, action) {
			//key của obj
			const { keyObj, value, keyObjOld } = action.payload;
			const arrConfig = state.modalEditProduct.data.Information.Configuration;
			state.modalEditProduct.data.Information.Configuration = arrConfig.map(item => {
				const keyItem = Object.keys(item);
				if (keyItem.includes(keyObjOld)) {
					return { [keyObj]: value };
				}
				return item;
			});
		},
		// cập nhật config cho 1 sản phẩm
		updateConfigurationForOneProduct(state, action) {
			const { newConfiguration, Id_Product } = action.payload;
			state.dataTable.data = state.dataTable.data.map(item => {
				if (item.Id_Product == Id_Product) {
					return {
						...item,
						Information: {
							...item.Information,
							Configuration: newConfiguration,
						},
					};
				}
				return item;
			});
		},
		// cập nhật lại hình ảnh khi xóa cho data table
		updateOnDeleteImageForDataTable(state, action) {
			const { Id_Product, urlImage } = action.payload;
			state.dataTable.data = state.dataTable.data.map(item => {
				if (item.Id_Product == Id_Product) {
					return {
						...item,
						Image: item.Image.filter(urlImg => urlImg !== urlImage),
					};
				}
				return item;
			});
		},
		// cập lại hình ảnh khi thêm cho data modal
		updateOnAddImageForDataTable(state, action) {
			const { Id_Product, urlImage } = action.payload;
			state.dataTable.data = state.dataTable.data.map(item => {
				if (item.Id_Product == Id_Product) {
					return {
						...item,
						Image: [...item.Image, urlImage],
					};
				}
				return item;
			});
		},
		// cập nhật lại hình ảnh khi xóa cho data modal
		updateOnDeleteImageForDataModal(state, action) {
			const urlImage = action.payload;
			state.modalEditProduct.data.Image = state.modalEditProduct.data.Image.filter(
				item => item !== urlImage
			);
		},
		// cập lại hình ảnh khi thêm cho data modal

		updateOnAddImageForDataModal(state, action) {
			const urlImage = action.payload;
			state.modalEditProduct.data.Image.push(urlImage);
		},
		// xóa 1 sản phẩm
		onDeleteOneProductOfDataTable(state, action) {
			const Id_Product = action.payload;
			state.dataTable.data = state.dataTable.data.filter(item => item.Id_Product != Id_Product);
		},
		//--------------------------- quản lí thêm sản phẩm
		setShowModalAdd(state, action) {
			state.modalAddProduct.show = action.payload;
		},
		// thêm sản phẩm mới vào data table
		onAddProductDataTable(state, action) {
			state.dataTable.data.unshift(action.payload);
		},
	},
});
export const getDataModalEdit = createSelector(
	state => state.managerProduct.modalEditProduct.data._id,
	state => state.managerProduct.modalEditProduct.data.Id_Product,

	state => state.managerProduct.modalEditProduct.data.ProductName,
	state => state.managerProduct.modalEditProduct.data.GroupName,
	state => state.managerProduct.modalEditProduct.data.ProductType,
	state => state.managerProduct.modalEditProduct.data.Path,
	state => state.managerProduct.modalEditProduct.data.CountEvaluate,

	state => state.managerProduct.modalEditProduct.data.CountComment,
	state => state.managerProduct.modalEditProduct.data.Image,

	state => state.managerProduct.modalEditProduct.data.Views,
	state => state.managerProduct.modalEditProduct.data.ProductSold,

	state => state.managerProduct.modalEditProduct.data.Star,

	state => state.managerProduct.modalEditProduct.data.Information.DisplayImage,
	state => state.managerProduct.modalEditProduct.data.Information.Price,
	state => state.managerProduct.modalEditProduct.data.Information.PriceSale,
	state => state.managerProduct.modalEditProduct.data.Information.RemainingAmount,
	state => state.managerProduct.modalEditProduct.data.Information.Configuration,

	(
		_id,
		Id_Product,
		ProductName,
		GroupName,
		ProductType,
		Path,
		CountEvaluate,
		CountComment,
		Image,
		Views,
		ProductSold,
		Star,
		DisplayImage,
		Price,
		PriceSale,
		RemainingAmount,
		Configuration
	) => ({
		_id,
		Id_Product,
		ProductName,
		GroupName,
		ProductType,
		Path,
		CountEvaluate,
		CountComment,
		Image,
		Views,
		ProductSold,
		Star,
		DisplayImage,
		Price,
		PriceSale,
		RemainingAmount,
		Configuration,
	})
);
export const getDataEditImage = createSelector(
	state => state.managerProduct.modalEditProduct.data.Id_Product,
	state => state.managerProduct.modalEditProduct.data.ProductType,
	state => state.managerProduct.modalEditProduct.data.Information.DisplayImage,
	(Id_Product, ProductType, DisplayImage) => ({
		Id_Product,
		ProductType,
		DisplayImage,
	})
);
export const managerProductActions = managerProductSlice.actions;
export default managerProductSlice.reducer;
