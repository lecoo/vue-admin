import axios from 'axios';

let base = '/assetmgr_api';

export const requestLogin = params => {
	return axios.post(`${base}/Token`, params).then(res => res.data);
};

export const getProductsPage = params => {
	return axios.get(`${base}/Products`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addProduct = params => {
	return axios.post(`${base}/Product`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editProduct = params => {
	return axios.put(`${base}/Product`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteProduct = params => {
	return axios.delete(`${base}/Product`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteProducts = params => {
	return axios.delete(`${base}/Products`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};
