<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.account_id" placeholder="账户ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.acco_com" placeholder="开户公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="更新日期" clearable v-model="filters.update_date"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRrtFeeParams">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="rrt_fee_params" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" :cell-style="cellStyle" :header-cell-style="headerCellStyle" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="account_id" label="账户ID" width="80">
			</el-table-column>
			<el-table-column prop="account.acco_com" label="开户公司" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="account.acco" label="用户代码" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="update_date" label="更新日期" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="sh_discount" label="上交所折扣率" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="sz_discount" label="深交所折扣率" width="140" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" min-width="180">
				<template scope="scope">
					<el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page_size" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="账户" prop="account_id">
					<el-select v-model="editForm.account_id" clearable filterable placeholder="请选择账户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="更新日期" prop="update_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.update_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="上交所折扣率" prop="sh_discount">
					<el-input v-model="editForm.sh_discount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="深交所折扣率" prop="sz_discount">
					<el-input v-model="editForm.sz_discount" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新建" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账户" prop="account_id">
					<el-select v-model="addForm.account_id" clearable filterable placeholder="请选择账户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="更新日期" prop="update_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.update_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="上交所折扣率" prop="sh_discount">
					<el-input v-model="addForm.sh_discount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="深交所折扣率" prop="sz_discount">
					<el-input v-model="addForm.sz_discount" auto-complete="off"></el-input>
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
		getRrtFeeParamsPage,
		addRrtFeeParam,
		editRrtFeeParam,
		deleteRrtFeeParam,
		deleteRrtFeeParams,
		getAccountsPage,
	} from '../api/api';

	export default {
		mixins: [util],
		
		data() {
			return {
				filters: {
					
				},
				rrt_fee_params: [],
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
					sh_discount: [{
						required: true,
						message: '请设置上交所折扣率',
					}],
					sz_discount: [{
						required: true,
						message: '请设置深交所折扣率',
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
					sh_discount: [{
						required: true,
						message: '请设置上交所折扣率',
					}],
					sz_discount: [{
						required: true,
						message: '请设置深交所折扣率',
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
					return account.product.prod_name + " " + account.acco_com + " " + account.acco;
				else
					return account.product.prod_name + " " + account.acco_com + " " + account.acco + "(已停用)";
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getRrtFeeParams();
			},
			getRrtFeeParams: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					account_id: this.filters.account_id,
					"account.acco_com_like": this.filters.acco_com,
					update_date: this.formatDate(this.filters.update_date),
				};
				this.listLoading = true;
				//NProgress.start();
				getRrtFeeParamsPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.rrt_fee_params = res.data.data;
						this.listLoading = false;
						// NProgress.done();
					})
					.catch(error => {
						this.listLoading = false;
						//NProgress.done();
						let rsp = error.response.data;
						if ('err_code' in rsp && 'err_code_des' in rsp) {
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
					deleteRrtFeeParam(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getRrtFeeParams();
						})
						.catch(error => {
							this.listLoading = false;
							//NProgress.done();
							let rsp = error.response.data;
							if ('err_code' in rsp && 'err_code_des' in rsp) {
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
					acco_type: "stock",
					sort: "enabled,acco_com",
					order: "desc,asc",
				};
				getAccountsPage(para)
					.then((res) => {
						this.accounts = res.data.data;
						this.editFormVisible = true;
						this.editForm = Object.assign({}, row);
					})
					.catch(error => {
						let rsp = error.response.data;
						if ('err_code' in rsp && 'err_code_des' in rsp) {
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
					acco_type: "stock",
					sort: "enabled,acco_com",
					order: "desc,asc",
				};
				getAccountsPage(para)
					.then((res) => {
						this.accounts = res.data.data;
						this.addFormVisible = true;
						this.addForm = {
							
						};
					})
					.catch(error => {
						let rsp = error.response.data;
						if ('err_code' in rsp && 'err_code_des' in rsp) {
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
							para.update_date = this.formatDate(para.update_date);
							editRrtFeeParam(para)
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
										this.getRrtFeeParams();
									}
								})
								.catch(error => {
									this.editLoading = false;
									//NProgress.done();
									let rsp = error.response.data;
									if ('err_code' in rsp && 'err_code_des' in rsp) {
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
							para.update_date = this.formatDate(para.update_date);
							addRrtFeeParam(para)
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
										this.getRrtFeeParams();
									}
								})
								.catch(error => {
									this.addLoading = false;
									//NProgress.done();
									let rsp = error.response.data;
									if ('err_code' in rsp && 'err_code_des' in rsp) {
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
				this.getRrtFeeParams();
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
					deleteRrtFeeParams(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getRrtFeeParams();
						})
						.catch(error => {
							this.listLoading = false;
							//NProgress.done();
							let rsp = error.response.data;
							if ('err_code' in rsp && 'err_code_des' in rsp) {
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
			this.getRrtFeeParams();
		}
	}
</script>

<style scoped>

</style>
