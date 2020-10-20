<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.account_id" clearable filterable placeholder="请选择账户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="交易日" clearable v-model="filters.trade_date"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.remarks" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTrusteeAccountChanges">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="trustee_account_changes" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="account.product.prod_name" label="产品名称" width="160">
			</el-table-column>
			<el-table-column prop="account.acco_com" label="开户公司" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="trade_date" label="交易日" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="in_transit_chg" label="在途资产增量" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="liability_chg" label="应计负债增量" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="available_chg" label="可用资金增量" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" min-width="140" sortable="custom">
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
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="托管户" prop="account_id">
					<el-select v-model="editForm.account_id" clearable filterable placeholder="请选择托管户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="交易日" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.trade_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="在途资产增量" prop="in_transit_chg">
					<el-input-number v-model="editForm.in_transit_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="应计负债增量" prop="liability_chg">
					<el-input-number v-model="editForm.liability_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="可用资金增量" prop="available_chg">
					<el-input-number v-model="editForm.available_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.remarks" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新建" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="托管户" prop="account_id">
					<el-select v-model="addForm.account_id" clearable filterable placeholder="请选择托管户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="交易日" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.trade_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="在途资产增量" prop="in_transit_chg">
					<el-input-number v-model="addForm.in_transit_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="应计负债增量" prop="liability_chg">
					<el-input-number v-model="addForm.liability_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="可用资金增量" prop="available_chg">
					<el-input-number v-model="addForm.available_chg" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.remarks" auto-complete="off"></el-input>
				</el-form-item>
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
		getTrusteeAccountChangesPage,
		addTrusteeAccountChange,
		editTrusteeAccountChange,
		deleteTrusteeAccountChange,
		deleteTrusteeAccountChanges,
		getAccountsPage,
	} from '../api/api';

	export default {
		data() {
			return {
				filters: {

				},
				trustee_account_changes: [],
				total: 0,
				page: 1,
				page_size: 15,
				sort: '',
				order: '',
				listLoading: false,
				sels: [], //列表选中列
				accounts: [],

				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					account_id: [{
						required: true,
						message: '请选择账户',
					}],
					update_date: [{
						required: true,
						message: '请选择更新日期',
					}],
					ratio: [{
						required: true,
						message: '请设置佣金倍数',
					}],
					security: [{
						required: true,
						message: '请设置投资者保障基金费率',
					}],
				},
				//编辑界面数据
				editForm: {

				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					account_id: [{
						required: true,
						message: '请选择账户',
					}],
					update_date: [{
						required: true,
						message: '请选择更新日期',
					}],
					ratio: [{
						required: true,
						message: '请设置佣金倍数',
					}],
					security: [{
						required: true,
						message: '请设置投资者保障基金费率',
					}],
				},
				//新增界面数据
				addForm: {

				}

			}
		},
		methods: {
			formatRate: function(row, column) {
				return row[column.property].toFixed(5);
			},
			formatDate: function(ctrlValue) {
				return (!ctrlValue || ctrlValue == '') ? null : util.formatDate.format(new Date(ctrlValue), 'yyyy-MM-dd');
			},
			formatAccount: function(account) {
				if (account.enabled)
					return account.product.prod_name + " " + account.acco_com;
				else
					return account.product.prod_name + " " + account.acco_com + "(已停用)";
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getTrusteeAccountChanges();
			},
			getTrusteeAccountChanges: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					account_id: this.filters.account_id,
					trade_date: this.formatDate(this.filters.trade_date),
					remarks_like: this.filters.remarks,
				};
				this.listLoading = true;
				//NProgress.start();
				getTrusteeAccountChangesPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.trustee_account_changes = res.data.data;
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
					deleteTrusteeAccountChange(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getTrusteeAccountChanges();
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
				this.addForm = {
					trade_date: new Date().format("yyyy-MM-dd"),
					remarks: "",
				};
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.trade_date = this.formatDate(para.trade_date);
							editTrusteeAccountChange(para)
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
										this.getTrusteeAccountChanges();
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
							para.trade_date = this.formatDate(para.trade_date);
							addTrusteeAccountChange(para)
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
										this.getTrusteeAccountChanges();
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
				this.getTrusteeAccountChanges();
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
					deleteTrusteeAccountChanges(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getTrusteeAccountChanges();
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
			let para = {
				page: 1,
				page_size: 1000,
				acco_type: "trustee",
				sort: "enabled,id",
				order: "desc,desc",
			};
			getAccountsPage(para)
				.then((res) => {
					this.accounts = res.data.data;
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
			this.getTrusteeAccountChanges();
		}
	}
</script>

<style scoped>

</style>
