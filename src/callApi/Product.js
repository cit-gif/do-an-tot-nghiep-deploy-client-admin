import api from '@src/config/api';
export default Product = {
	async getGroupProduct() {
		const res = await api.get();
	},
	async saveWhenEditProduct(data) {
		try {
			const res = await api.post('/api/admin/edit-product', data);
		} catch (error) {}
	},
};
