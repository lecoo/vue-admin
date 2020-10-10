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

// ETF手续费参数接口
export const getEtfFeeParamsPage = params => {
	return axios.get(`${base}/EtfFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addEtfFeeParam = params => {
	return axios.post(`${base}/EtfFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editEtfFeeParam = params => {
	return axios.put(`${base}/EtfFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteEtfFeeParam = params => {
	return axios.delete(`${base}/EtfFeeParam`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteEtfFeeParams = params => {
	return axios.delete(`${base}/EtfFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// ETF手续费参数接口
export const getFuturesFeeParamsPage = params => {
	return axios.get(`${base}/FuturesFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addFuturesFeeParam = params => {
	return axios.post(`${base}/FuturesFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editFuturesFeeParam = params => {
	return axios.put(`${base}/FuturesFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFuturesFeeParam = params => {
	return axios.delete(`${base}/FuturesFeeParam`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFuturesFeeParams = params => {
	return axios.delete(`${base}/FuturesFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 可转债手续费参数接口
export const getCbondFeeParamsPage = params => {
	return axios.get(`${base}/CbondFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addCbondFeeParam = params => {
	return axios.post(`${base}/CbondFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editCbondFeeParam = params => {
	return axios.put(`${base}/CbondFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteCbondFeeParam = params => {
	return axios.delete(`${base}/CbondFeeParam`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteCbondFeeParams = params => {
	return axios.delete(`${base}/CbondFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 国债逆回购手续费参数接口
export const getRrtFeeParamsPage = params => {
	return axios.get(`${base}/RrtFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addRrtFeeParam = params => {
	return axios.post(`${base}/RrtFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editRrtFeeParam = params => {
	return axios.put(`${base}/RrtFeeParam`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteRrtFeeParam = params => {
	return axios.delete(`${base}/RrtFeeParam`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteRrtFeeParams = params => {
	return axios.delete(`${base}/RrtFeeParams`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 公募基金申赎接口
export const getFundPurchRedemRecordsPage = params => {
	return axios.get(`${base}/FundPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addFundPurchRedemRecord = params => {
	return axios.post(`${base}/FundPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editFundPurchRedemRecord = params => {
	return axios.put(`${base}/FundPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFundPurchRedemRecord = params => {
	return axios.delete(`${base}/FundPurchRedemRecord`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFundPurchRedemRecords = params => {
	return axios.delete(`${base}/FundPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 公募基金预估净值接口
export const getFundNavEstisPage = params => {
	return axios.get(`${base}/FundNavEstis`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addFundNavEsti = params => {
	return axios.post(`${base}/FundNavEsti`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editFundNavEsti = params => {
	return axios.put(`${base}/FundNavEsti`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFundNavEsti = params => {
	return axios.delete(`${base}/FundNavEsti`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteFundNavEstis = params => {
	return axios.delete(`${base}/FundNavEstis`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 场外货币基金申赎接口
export const getMoneyfundPurchRedemRecordsPage = params => {
	return axios.get(`${base}/MoneyfundPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addMoneyfundPurchRedemRecord = params => {
	return axios.post(`${base}/MoneyfundPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editMoneyfundPurchRedemRecord = params => {
	return axios.put(`${base}/MoneyfundPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteMoneyfundPurchRedemRecord = params => {
	return axios.delete(`${base}/MoneyfundPurchRedemRecord`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteMoneyfundPurchRedemRecords = params => {
	return axios.delete(`${base}/MoneyfundPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

// 嵌套产品申赎接口
export const getEmbeddingPurchRedemRecordsPage = params => {
	return axios.get(`${base}/EmbeddingPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const addEmbeddingPurchRedemRecord = params => {
	return axios.post(`${base}/EmbeddingPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		},
	});
};

export const editEmbeddingPurchRedemRecord = params => {
	return axios.put(`${base}/EmbeddingPurchRedemRecord`, params, {
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteEmbeddingPurchRedemRecord = params => {
	return axios.delete(`${base}/EmbeddingPurchRedemRecord`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};

export const deleteEmbeddingPurchRedemRecords = params => {
	return axios.delete(`${base}/EmbeddingPurchRedemRecords`, {
		params: params,
		headers: {
			"token": sessionStorage.getItem('token')
		}
	});
};
