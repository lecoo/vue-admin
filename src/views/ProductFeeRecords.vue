<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.prod_name" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="付费日期" clearable v-model="filters.trade_date"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.remarks" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProductFeeRecords">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="product_fee_records" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="product.prod_name" label="产品名称" width="160" sortable="custom">
			</el-table-column>
			<el-table-column prop="trade_date" label="付费日期" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="fee_type" label="费用类型" width="120" :formatter="formatFeeType" sortable="custom">
			</el-table-column>
			<el-table-column prop="amount" label="金额" width="120" :formatter="formatAmount" sortable="custom">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" min-width="120">
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
				<el-form-item label="所属产品" prop="product_id">
					<el-select v-model="editForm.product_id" clearable filterable placeholder="请选择产品">
						<el-option v-for="product in products" :key="product.id" :value="product.id" :label="formatProduct(product)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="付费日期" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.trade_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="费用类型" prop="fee_type">
					<el-select v-model="editForm.fee_type" clearable filterable placeholder="请选择费用类型">
						<el-option :key="1" value="1" label="1-管理费"></el-option>
						<el-option :key="2" value="2" label="2-托管费"></el-option>
						<el-option :key="3" value="3" label="3-投顾费"></el-option>
						<el-option :key="4" value="4" label="4-增值税"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="金额" prop="amount">
					<el-input-number v-model="editForm.amount" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
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
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="所属产品" prop="product_id">
					<el-select v-model="addForm.product_id" clearable filterable placeholder="请选择产品">
						<el-option v-for="product in products" :key="product.id" :value="product.id" :label="formatProduct(product)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="付费日期" prop="trade_date">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.trade_date" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="费用类型" prop="fee_type">
					<el-select v-model="addForm.fee_type" clearable filterable placeholder="请选择费用类型">
						<el-option :key="1" value="1" label="1-管理费"></el-option>
						<el-option :key="2" value="2" label="2-托管费"></el-option>
						<el-option :key="3" value="3" label="3-投顾费"></el-option>
						<el-option :key="4" value="4" label="4-增值税"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="金额" prop="amount">
					<el-input-number v-model="addForm.amount" :precision="2" :step="0.01" :controls-position="right"></el-input-number>
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
		getProductFeeRecordsPage,
		addProductFeeRecord,
		editProductFeeRecord,
		deleteProductFeeRecord,
		deleteProductFeeRecords,
		getProductsPage,
	} from '../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
					prod_name: '',
				},
				product_fee_records: [],
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
					product_id: [{
						required: true,
						message: '请选择产品',
					}],
					trade_date: [{
						required: true,
						message: '请选择交易日期',
					}],
					fee_type: [{
						required: true,
						message: '请选择费用类型',
					}],
					amount: [{
						required: true,
						message: '请填写金额',
					}],
				},
				//编辑界面数据
				editForm: {
					
				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					product_id: [{
						required: true,
						message: '请选择产品',
					}],
					trade_date: [{
						required: true,
						message: '请选择交易日期',
					}],
					fee_type: [{
						required: true,
						message: '请选择费用类型',
					}],
					amount: [{
						required: true,
						message: '请填写金额',
					}],
				},
				//新增界面数据
				addForm: {
					
				}

			}
		},
		methods: {
			formatFeeType: function(row, column) {
				if (row.fee_type == 1) return "管理费";
				if (row.fee_type == 2) return "托管费";
				if (row.fee_type == 3) return "投顾费";
				if (row.fee_type == 4) return "增值税";
				return "未知";
			},
			formatAmount: function(row, column) {
				return row.amount.toFixed(2);
			},
			formatDate: function(ctrlValue) {
				return (!ctrlValue || ctrlValue == '') ? null : util.formatDate.format(new Date(ctrlValue), 'yyyy-MM-dd');
			},
			formatProduct: function(product) {
				if (product.enabled)
					return product.prod_name;
				else
					return product.prod_name + "(已停用)";
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getProductFeeRecords();
			},
			getProductFeeRecords: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					"product.prod_name_like": this.filters.prod_name,
					trade_date: this.formatDate(this.filters.trade_date),
					remarks_like: this.filters.remarks,
				};
				this.listLoading = true;
				//NProgress.start();
				getProductFeeRecordsPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.product_fee_records = res.data.data;
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
					deleteProductFeeRecord(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getProductFeeRecords();
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
							para.trade_date = this.formatDate(para.trade_date);
							editProductFeeRecord(para)
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
										this.getProductFeeRecords();
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
							addProductFeeRecord(para)
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
										this.getProductFeeRecords();
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
				this.getProductFeeRecords();
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
					deleteProductFeeRecords(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getProductFeeRecords();
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
			this.getProductFeeRecords();
		}
	}
</script>

<style scoped>

</style>
