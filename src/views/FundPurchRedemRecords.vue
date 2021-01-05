<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.acco_com" placeholder="开户公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.stra_name" placeholder="策略名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="交易日" clearable v-model="filters.trade_date"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.remarks" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getFundPurchRedemRecords">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="fund_purch_redem_records" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" :cell-style="cellStyle" :header-cell-style="headerCellStyle" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="account.product.prod_name" label="产品名称" width="160">
			</el-table-column>
			<el-table-column prop="account.acco_com" label="开户公司" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="strategy.stra_name" label="策略名称" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="trade_date" label="交易日" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="sec_code" label="基金代码" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="direction" label="申/赎" width="120" :formatter="formatDirection" sortable="custom">
			</el-table-column>
			<el-table-column prop="amount" label="金额" width="120" :formatter="formatAmount">
			</el-table-column>
			<el-table-column prop="confirmed" label="是否已确认" width="140" :formatter="formatConfirmed" sortable="custom">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" min-width="120">
			</el-table-column>
			<el-table-column label="操作" width="180">
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
				<el-form-item label="策略" prop="strategy_id">
					<el-select v-model="editForm.strategy_id" clearable filterable placeholder="请选择策略">
						<el-option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id" :label="formatStrategy(strategy)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组合编号">
					<el-input key="port_no" v-model="editForm.port_no" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="交易日" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.trade_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="基金代码" prop="sec_code">
					<el-input key="sec_code" v-model="editForm.sec_code" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="申/赎" prop="direction">
					<el-radio-group v-model="editForm.direction">
						<el-radio class="radio" :label="1">申购</el-radio>
						<el-radio class="radio" :label="-1">赎回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="成交份额" prop="unit">
					<el-input-number v-model="editForm.unit" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-form-item :label="editForm.direction!=null?(editForm.direction>0?'申购金额(费前)':'赎回金额(费后)'):'交易金额'" prop="amount">
					<el-input-number v-model="editForm.amount" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-form-item label="手续费" prop="fee">
					<el-input-number v-model="editForm.fee" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="formatConfirmedLabel(editForm.direction)" prop="confirmed">
							<el-radio-group v-model="editForm.confirmed">
								<el-radio class="radio" :label="false">未确认</el-radio>
								<el-radio class="radio" :label="true">已确认</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="确认时间" v-if="editForm.confirmed" prop="confirm_date">
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.confirm_date"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
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
		<el-dialog title="新建" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账户" prop="account_id">
					<el-select v-model="addForm.account_id" clearable filterable placeholder="请选择账户">
						<el-option v-for="account in accounts" :key="account.id" :value="account.id" :label="formatAccount(account)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="策略" prop="strategy_id">
					<el-select v-model="addForm.strategy_id" clearable filterable placeholder="请选择策略">
						<el-option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id" :label="formatStrategy(strategy)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组合编号">
					<el-input key="port_no" v-model="addForm.port_no" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="交易日" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.trade_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="基金代码" prop="sec_code">
					<el-input key="sec_code" v-model="addForm.sec_code" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="申/赎" prop="direction">
					<el-radio-group v-model="addForm.direction">
						<el-radio class="radio" :label="1">申购</el-radio>
						<el-radio class="radio" :label="-1">赎回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="成交份额" prop="unit">
					<el-input-number v-model="addForm.unit" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-form-item :label="addForm.direction!=null?(addForm.direction>0?'申购金额(费前)':'赎回金额(费后)'):'交易金额'" prop="amount">
					<el-input-number v-model="addForm.amount" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-form-item label="手续费" prop="fee">
					<el-input-number v-model="addForm.fee" :precision="2" :step="0.01"></el-input-number>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="formatConfirmedLabel(addForm.direction)" prop="confirmed">
							<el-radio-group v-model="addForm.confirmed">
								<el-radio class="radio" :label="false">未确认</el-radio>
								<el-radio class="radio" :label="true">已确认</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="确认时间" v-if="addForm.confirmed" prop="confirm_date">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.confirm_date"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
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
		getFundPurchRedemRecordsPage,
		addFundPurchRedemRecord,
		editFundPurchRedemRecord,
		deleteFundPurchRedemRecord,
		deleteFundPurchRedemRecords,
		getAccountsPage,
		getStrategysPage,
	} from '../api/api';

	export default {
		mixins: [util],
		
		data() {
			return {
				filters: {
					name: '',
					prod_name: '',
				},
				fund_purch_redem_records: [],
				total: 0,
				page: 1,
				page_size: 15,
				sort: '',
				order: '',
				listLoading: false,
				sels: [], //列表选中列
				
				accountsLoading: false,
				accounts: [],
				strategiesLoading: false,
				strategies: [],

				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					account_id: [{
						required: true,
						message: '请选择账户',
					}],
					strategy_id: [{
						required: true,
						message: '请选择策略',
					}],
					trade_date: [{
						required: true,
						message: '请选择交易日期',
					}],
					sec_code: [{
						required: true,
						message: '请填写基金代码',
					}],
					direction: [{
						required: true,
						message: '请选择申赎方向',
					}],
					unit: [{
						required: true,
						message: '请填写成交份额',
					}],
					amount: [{
						required: true,
						message: '请填写交易金额',
					}],
					fee: [{
						required: true,
						message: '请填写交易手续费',
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
					strategy_id: [{
						required: true,
						message: '请选择策略',
					}],
					trade_date: [{
						required: true,
						message: '请选择交易日期',
					}],
					sec_code: [{
						required: true,
						message: '请填写基金代码',
					}],
					direction: [{
						required: true,
						message: '请选择申赎方向',
					}],
					unit: [{
						required: true,
						message: '请填写成交份额',
					}],
					amount: [{
						required: true,
						message: '请填写交易金额',
					}],
					fee: [{
						required: true,
						message: '请填写交易手续费',
					}],
				},
				//新增界面数据
				addForm: {
					trade_date: new Date().format("yyyy-MM-dd"),
					port_no: "",
					fee: 0,
					confirmed: false,
					remarks: "",
				}

			}
		},
		methods: {
			formatDirection: function(row, column) {
				if (row.direction == 1) return "申购";
				if (row.direction == -1) return "赎回";
				if (row.direction != null) return row.direction.toString();
				return "";
			},
			formatAmount: function(row, column) {
				return row.amount.toFixed(2);
			},
			formatConfirmed: function(row, column) {
				if(row.direction > 0) {
					if (row.confirmed) {
						return "份额已确认";
					} else {
						return "份额未确认";
					}
				} else {
					if (row.confirmed) {
						return "金额已确认";
					} else {
						return "金额未确认";
					}
				}
			},
			formatConfirmedLabel: function(direction) {
				if(direction > 0) {
					return "份额是否已确认"
				} else {
					return "金额是否已确认";
				}
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
			formatStrategy: function(strategy) {
				return strategy.code + " " + strategy.stra_name;
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getFundPurchRedemRecords();
			},
			getFundPurchRedemRecords: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					"account.acco_com_like": this.filters.acco_com,
					"strategy.stra_name_like": this.filters.stra_name,
					trade_date: this.formatDate(this.filters.trade_date),
					remarks_like: this.filters.remarks,
				};
				this.listLoading = true;
				//NProgress.start();
				getFundPurchRedemRecordsPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.fund_purch_redem_records = res.data.data;
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
					deleteFundPurchRedemRecord(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getFundPurchRedemRecords();
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
				this.accountsLoading = true;
				this.strategiesLoading = true;
				
				getAccountsPage({
					page: 1,
					page_size: 1000,
					acco_type: "sales",
					sort: "enabled,acco_com",
					order: "desc,asc",
				}).then((res) => {
					this.accountsLoading = false;
					this.accounts = res.data.data;
					if(!this.strategiesLoading) {
						this.editFormVisible = true;
						this.editForm = Object.assign({}, row);
					}
				}).catch(error => {
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
				
				getStrategysPage({
					page: 1,
					page_size: 1000,
					sort: "stra_name",
					order: "asc",
				}).then((res) => {
					this.strategiesLoading = false;
					this.strategies = res.data.data;
					if(!this.accountsLoading) {
						this.editFormVisible = true;
						this.editForm = Object.assign({}, row);
					}
				}).catch(error => {
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
				this.accountsLoading = true;
				this.strategiesLoading = true;
				
				getAccountsPage({
					page: 1,
					page_size: 1000,
					acco_type: "sales",
					sort: "enabled,acco_com",
					order: "desc,asc",
				}).then((res) => {
					this.accountsLoading = false;
					this.accounts = res.data.data;
					if(!this.strategiesLoading) {
						this.addFormVisible = true;
						this.addForm = {
							port_no: '',
							confirmed: false,
							remarks: '',
						};
					}
				}).catch(error => {
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
				
				getStrategysPage({
					page: 1,
					page_size: 1000,
					sort: "stra_name",
					order: "asc",
				}).then((res) => {
					this.strategiesLoading = false;
					this.strategies = res.data.data;
					if(!this.accountsLoading) {
						this.addFormVisible = true;
						this.addForm = {
							port_no: '',
							confirmed: false,
							remarks: '',
						};
					}
				}).catch(error => {
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
							para.trade_date = this.formatDate(para.trade_date);
							para.confirm_date = para.confirmed ? this.formatDate(para.confirm_date) : null;
							editFundPurchRedemRecord(para)
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
										this.getFundPurchRedemRecords();
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
							para.confirm_date = para.confirmed ? this.formatDate(para.confirm_date) : null;
							addFundPurchRedemRecord(para)
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
										this.getFundPurchRedemRecords();
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
				if(this.sort == "account.product.prod_name") {
					this.sort = "account.product_id";
				}
				this.getFundPurchRedemRecords();
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
						id_in: ids
					};
					deleteFundPurchRedemRecords(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getFundPurchRedemRecords();
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
			this.getFundPurchRedemRecords();
		}
	}
</script>

<style scoped>

</style>
