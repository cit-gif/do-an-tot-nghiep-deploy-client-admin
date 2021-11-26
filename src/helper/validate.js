import Joi from "joi";
const register = async (data) => {
	const Schema = Joi.object({
		// name: Joi.string()
		// 	.regex(/^[a-zA-Z0-9]{3,50}$/)
		// 	.required(),
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const login = async (data) => {
	const Schema = Joi.object({
		UserName: Joi.string().min(2).required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
export { register, login };
