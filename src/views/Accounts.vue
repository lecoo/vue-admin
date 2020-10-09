<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.code" placeholder="账户编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.prod_name" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.acco" placeholder="用户代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.acco_type" clearable placeholder="账户类型">
						<el-option key="trustee" value="trustee" label="trustee-托管户"></el-option>
						<el-option key="stock" value="stock" label="stock-证券"></el-option>
						<el-option key="futures" value="futures" label="futures-期货"></el-option>
						<el-option key="option" value="option" label="option-期权"></el-option>
						<el-option key="credit" value="credit" label="credit-信用"></el-option>
						<el-option key="sales" value="sales" label="sales-公募基金销售"></el-option>
						<el-option key="self" value="self" label="self-我司账户"></el-option>
						<el-option key="other" value="other" label="other-其他场外账户"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.acco_com" placeholder="开户公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.enabled" clearable placeholder="启用状态">
						<el-option value="1" label="使用中"></el-option>
						<el-option value="0" label="已停用"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAccounts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="accounts" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="code" label="账户编码" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="product.prod_name" label="所属产品" min-width="160" sortable="custom">
			</el-table-column>
			<el-table-column prop="acco" label="用户代码" width="160" sortable="custom">
			</el-table-column>
			<el-table-column prop="acco_type" label="账户类型" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="acco_com" label="开户公司" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="enabled" label="启用状态" width="120" :formatter="formatEnabled" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page_size" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="编码" prop="code">
					<el-input v-model="editForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属产品">
					<el-select v-model="editForm.product_id" clearable filterable placeholder="请选择产品">
						<el-option v-for="product in products" :key="product.id" :value="product.id" :label="formatProduct(product)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户代码">
					<el-input v-model="editForm.acco" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户类型" prop="acco_type">
					<el-select v-model="editForm.acco_type" placeholder="请选择账户类型">
						<el-option key="trustee" value="trustee" label="trustee-托管户"></el-option>
						<el-option key="stock" value="stock" label="stock-证券"></el-option>
						<el-option key="futures" value="futures" label="futures-期货"></el-option>
						<el-option key="option" value="option" label="option-期权"></el-option>
						<el-option key="credit" value="credit" label="credit-信用"></el-option>
						<el-option key="sales" value="sales" label="sales-公募基金销售"></el-option>
						<el-option key="self" value="self" label="self-我司账户"></el-option>
						<el-option key="other" value="other" label="other-其他场外账户"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开户公司">
					<el-input v-model="editForm.acco_com" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="enabled">
					<el-radio-group v-model="editForm.enabled">
						<el-radio class="radio" :label="true">启用</el-radio>
						<el-radio class="radio" :label="false">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="editForm.acco_type == 'futures'">
					<el-row>
						<el-col :span="12">
							<el-form-item label="密码">
								<el-input v-model="editForm.password" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="BrokerID">
								<el-input v-model="editForm.broker_id" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="交易前置">
								<el-input v-model="editForm.trade_front" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="行情前置">
								<el-input v-model="editForm.market_front" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="AuthCode">
								<el-input v-model="editForm.auth_code" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="AppID">
								<el-input v-model="editForm.app_id" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="柜台API">
						<el-select v-model="editForm.api_version" clearable placeholder="请选择柜台API">
							<el-option key="6_3_15" value="6_3_15" label="CTP 6.3.15"></el-option>
							<el-option key="ronghang" value="ronghang" label="融航"></el-option>
							<el-option key="jees" value="jees" label="杰易斯"></el-option>
							<el-option key="epi" value="epi" label="EPI"></el-option>
						</el-select>
					</el-form-item>
				</template>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新建" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="编码" prop="code">
					<el-input v-model="addForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属产品">
					<el-select v-model="addForm.product_id" clearable filterable placeholder="请选择产品">
						<el-option v-for="product in products" :key="product.id" :value="product.id" :label="formatProduct(product)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户代码">
					<el-input v-model="addForm.acco" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户类型" prop="acco_type">
					<el-select v-model="addForm.acco_type" placeholder="请选择账户类型">
						<el-option key="trustee" value="trustee" label="trustee-托管户"></el-option>
						<el-option key="stock" value="stock" label="stock-证券"></el-option>
						<el-option key="futures" value="futures" label="futures-期货"></el-option>
						<el-option key="option" value="option" label="option-期权"></el-option>
						<el-option key="credit" value="credit" label="credit-信用"></el-option>
						<el-option key="sales" value="sales" label="sales-公募基金销售"></el-option>
						<el-option key="self" value="self" label="self-我司账户"></el-option>
						<el-option key="other" value="other" label="other-其他场外账户"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开户公司">
					<el-input v-model="addForm.acco_com" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="enabled">
					<el-radio-group v-model="addForm.enabled">
						<el-radio class="radio" :label="true">启用</el-radio>
						<el-radio class="radio" :label="false">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="addForm.acco_type == 'futures'">
					<el-row>
						<el-col :span="12">
							<el-form-item label="密码">
								<el-input v-model="addForm.password" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="BrokerID">
								<el-input v-model="addForm.broker_id" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="交易前置">
								<el-input v-model="addForm.trade_front" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="行情前置">
								<el-input v-model="addForm.market_front" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="AuthCode">
								<el-input v-model="addForm.auth_code" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="AppID">
								<el-input v-model="addForm.app_id" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="柜台API">
						<el-select v-model="addForm.api_version" clearable placeholder="请选择柜台API">
							<el-option key="6_3_15" value="6_3_15" label="CTP 6.3.15"></el-option>
							<el-option key="ronghang" value="ronghang" label="融航"></el-option>
							<el-option key="jees" value="jees" label="杰易斯"></el-option>
							<el-option key="epi" value="epi" label="EPI"></el-option>
						</el-select>
					</el-form-item>
				</template>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../common/js/util';
	//import NProgress from 'nprogress'
	import {
		getAccountsPage,
		addAccount,
		editAccount,
		deleteAccount,
		deleteAccounts,
		getProductsPage,
	} from '../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
					prod_name: '',
				},
				accounts: [],
				total: 0,
				page: 1,
				page_size: 15,
				sort: '',
				order: '',
				listLoading: false,
				sels: [], //列表选中列
				products: [],

				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					code: [{
						required: true,
						message: '请输入编码',
						trigger: 'blur'
					}],
					acco_type: [{
						required: true,
						message: '请选择账户类型',
					}],
					enabled: [{
						required: true,
						message: '请选择是否启用',
					}],
				},
				//编辑界面数据
				editForm: {
					code: '',
					enabled: true,
				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					code: [{
						required: true,
						message: '请输入编码',
						trigger: 'blur'
					}],
					acco_type: [{
						required: true,
						message: '请选择账户类型',
					}],
					enabled: [{
						required: true,
						message: '请选择是否启用',
					}],
				},
				//新增界面数据
				addForm: {
					code: '',
					enabled: true,
				}
			}
		},
		methods: {
			formatEnabled: function(row, column) {
				if (row.enabled) return "使用中";
				return "已停用";
			},
			formatProduct: function(product) {
				if (product.enabled)
					return product.prod_name;
				else
					return product.prod_name + "(已停用)";
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getAccounts();
			},
			getAccounts: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					code_like: this.filters.code,
					"product.prod_name_like": this.filters.prod_name,
					acco_like: this.filters.acco,
					acco_type: this.filters.acco_type,
					acco_com_like: this.filters.acco_com,
					enabled: this.filters.enabled,
				};
				this.listLoading = true;
				//NProgress.start();
				getAccountsPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.accounts = res.data.data;
						this.listLoading = false;
						// NProgress.done();
					})
					.catch(error => {
						this.listLoading = false;
						//NProgress.done();
						let rsp = error.response.data;
						if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
							this.$message({
								message: rsp.err_code + ": " + rsp.err_code_des,
								type: 'error'
							});
						} else {
							this.$message({
								message: error,
								type: 'error'
							});
						}
					});
			},
			//删除
			handleDel: function(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = {
						id: row.id
					};
					deleteAccount(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getAccounts();
						})
						.catch(error => {
							this.listLoading = false;
							//NProgress.done();
							let rsp = error.response.data;
							if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
								this.$message({
									message: rsp.err_code + ": " + rsp.err_code_des,
									type: 'error'
								});
							} else {
								this.$message({
									message: error,
									type: 'error'
								});
							}
						});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function(index, row) {
				let para = {
					page: 1,
					page_size: 1000,
					sort: "enabled,prod_name",
					order: "desc,asc",
				};
				getProductsPage(para)
					.then((res) => {
						this.products = res.data.data;
						this.editFormVisible = true;
						this.editForm = Object.assign({}, row);
					})
					.catch(error => {
						let rsp = error.response.data;
						if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
							this.$message({
								message: rsp.err_code + ": " + rsp.err_code_des,
								type: 'error'
							});
						} else {
							this.$message({
								message: error,
								type: 'error'
							});
						}
					});
			},
			//显示新增界面
			handleAdd: function() {
				let para = {
					page: 1,
					page_size: 1000,
					sort: "enabled,prod_name",
					order: "desc,asc",
				};
				getProductsPage(para)
					.then((res) => {
						this.products = res.data.data;
						this.addFormVisible = true;
						this.addForm = {
							code: '',
							enabled: true,
						};
					})
					.catch(error => {
						let rsp = error.response.data;
						if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
							this.$message({
								message: rsp.err_code + ": " + rsp.err_code_des,
								type: 'error'
							});
						} else {
							this.$message({
								message: error,
								type: 'error'
							});
						}
					});
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							editAccount(para)
								.then((response) => {
									this.editLoading = false;
									//NProgress.done();
									var rsp = response.data;
									let result_code = rsp.result_code;
									var data = rsp.data;
									if (result_code != "success") {
										this.$message({
											message: rsp.err_code + ": " + rsp.err_code_des,
											type: 'error'
										});
									} else {
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getAccounts();
									}
								})
								.catch(error => {
									this.editLoading = false;
									//NProgress.done();
									let rsp = error.response.data;
									if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
										this.$message({
											message: rsp.err_code + ": " + rsp.err_code_des,
											type: 'error'
										});
									} else {
										this.$message({
											message: error,
											type: 'error'
										});
									}
								});
						});
					}
				});
			},
			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							addAccount(para)
								.then((response) => {
									this.addLoading = false;
									//NProgress.done();
									var rsp = response.data;
									let result_code = rsp.result_code;
									var data = rsp.data;
									if (result_code != "success") {
										this.$message({
											message: rsp.err_code + ": " + rsp.err_code_des,
											type: 'error'
										});
									} else {
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm'].resetFields();
										this.addFormVisible = false;
										this.getAccounts();
									}
								})
								.catch(error => {
									this.addLoading = false;
									//NProgress.done();
									let rsp = error.response.data;
									if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
										this.$message({
											message: rsp.err_code + ": " + rsp.err_code_des,
											type: 'error'
										});
									} else {
										this.$message({
											message: error,
											type: 'error'
										});
									}
								});
						});
					}
				});
			},
			onSelectionChanged: function(sels) {
				this.sels = sels;
			},
			onSortChanged: function(val) {
				this.sort = val.prop;
				this.order = val.order;
				this.getAccounts();
			},
			//批量删除
			batchRemove: function() {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = {
						ids: ids
					};
					deleteAccounts(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getAccounts();
						})
						.catch(error => {
							this.listLoading = false;
							//NProgress.done();
							let rsp = error.response.data;
							if (typeof(rsp) == "object" && 'err_code' in rsp && 'err_code_des' in rsp) {
								this.$message({
									message: rsp.err_code + ": " + rsp.err_code_des,
									type: 'error'
								});
							} else {
								this.$message({
									message: error,
									type: 'error'
								});
							}
						});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getAccounts();
		}
	}
</script>

<style scoped>

</style>
