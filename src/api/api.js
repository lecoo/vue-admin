import axios from 'axios';

let base = '/assetmgr_api';

// 登录接口
export const requestLogin = params => {
	return axios.post(`${base}/Token`, params).then(res => res.data);
};

export const requestLogout = params => {
	return axios.delete(`${base}/Token`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 产品接口
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

// 账户接口
export const getAccountsPage = params => {
	return axios.get(`${base}/Accounts`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addAccount = params => {
	return axios.post(`${base}/Account`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editAccount = params => {
	return axios.put(`${base}/Account`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteAccount = params => {
	return axios.delete(`${base}/Account`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteAccounts = params => {
	return axios.delete(`${base}/Accounts`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 策略接口
export const getStrategysPage = params => {
	return axios.get(`${base}/Strategies`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addStrategy = params => {
	return axios.post(`${base}/Strategy`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editStrategy = params => {
	return axios.put(`${base}/Strategy`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteStrategy = params => {
	return axios.delete(`${base}/Strategy`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteStrategys = params => {
	return axios.delete(`${base}/Strategies`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 产品付费记录接口
export const getPurchRedemRecordsPage = params => {
	return axios.get(`${base}/PurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addPurchRedemRecord = params => {
	return axios.post(`${base}/PurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editPurchRedemRecord = params => {
	return axios.put(`${base}/PurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deletePurchRedemRecord = params => {
	return axios.delete(`${base}/PurchRedemRecord`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deletePurchRedemRecords = params => {
	return axios.delete(`${base}/PurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 产品扣费记录接口
export const getProductFeeRecordsPage = params => {
	return axios.get(`${base}/ProductFeeRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addProductFeeRecord = params => {
	return axios.post(`${base}/ProductFeeRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editProductFeeRecord = params => {
	return axios.put(`${base}/ProductFeeRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteProductFeeRecord = params => {
	return axios.delete(`${base}/ProductFeeRecord`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteProductFeeRecords = params => {
	return axios.delete(`${base}/ProductFeeRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};


// 股票手续费参数接口
export const getStockFeeParamsPage = params => {
	return axios.get(`${base}/StockFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addStockFeeParam = params => {
	return axios.post(`${base}/StockFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editStockFeeParam = params => {
	return axios.put(`${base}/StockFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteStockFeeParam = params => {
	return axios.delete(`${base}/StockFeeParam`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteStockFeeParams = params => {
	return axios.delete(`${base}/StockFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};
