import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Products from './views/Products.vue'
import Accounts from './views/Accounts.vue'
import Strategys from './views/Strategys.vue'
import PurchRedemRecords from './views/PurchRedemRecords.vue'
import ProductFeeRecords from './views/ProductFeeRecords.vue'
import StockFeeParams from './views/StockFeeParams.vue'
import EtfFeeParams from './views/EtfFeeParams.vue'
import FuturesFeeParams from './views/FuturesFeeParams.vue'
import CbondFeeParams from './views/CbondFeeParams.vue'
import RrtFeeParams from './views/RrtFeeParams.vue'

import Form from './views/test/Form.vue'
import Page4 from './views/test/Page4.vue'
import echarts from './views/test/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
		path: '/main',
		component: Main,
		name: '主页',
		hidden: true,
	},
	{
	    path: '/',
	    component: Home,
	    name: '',
	    iconCls: 'fa fa-bookmark',
	    leaf: true,//只有一个节点
	    children: [
	        { path: '/products', component: Products, name: '产品列表' }
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '',
	    iconCls: 'fa fa-bookmark',
	    leaf: true,//只有一个节点
	    children: [
	        { path: '/accounts', component: Accounts, name: '账户列表' }
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '',
	    iconCls: 'fa fa-bookmark',
	    leaf: true,//只有一个节点
	    children: [
	        { path: '/strategies', component: Strategys, name: '策略列表' }
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '',
	    iconCls: 'fa fa-bookmark',
	    leaf: true,//只有一个节点
	    children: [
	        { path: '/purch_redem_records', component: PurchRedemRecords, name: '产品申赎记录' }
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '',
	    iconCls: 'fa fa-bookmark',
	    leaf: true,//只有一个节点
	    children: [
	        { path: '/product_fee_records', component: ProductFeeRecords, name: '产品扣费记录' }
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '手续费参数',
	    iconCls: 'fa fa-bookmark',
	    children: [
	        { path: '/stock_fee_params', component: StockFeeParams, name: '股票手续费' },
			{ path: '/etf_fee_params', component: EtfFeeParams, name: 'ETF手续费' },
			{ path: '/futures_fee_params', component: FuturesFeeParams, name: '期货手续费' },
			{ path: '/cbond_fee_params', component: CbondFeeParams, name: '可转债手续费' },
			{ path: '/rrt_fee_params', component: RrtFeeParams, name: '国债逆回购手续费' },
	    ]
	},
    {
        path: '/',
		hidden: true,
        component: Home,
        name: '测试',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' },
			{ path: '/form', component: Form, name: 'Form' },
			{ path: '/page4', component: Page4, name: 'vuex测试' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;