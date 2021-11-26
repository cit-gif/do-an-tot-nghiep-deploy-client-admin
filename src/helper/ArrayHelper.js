import _ from 'lodash';

const ArrayHelper = {
	groupArrayByKey: (arr, bykey) => {
		return _(arr)
			.groupBy(x => x[bykey])
			.map((value, key) => ({ [bykey]: key, array: value }))
			.value();
	},
};
export default ArrayHelper;
