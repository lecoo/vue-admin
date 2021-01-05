<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.code" placeholder="产品编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.prod_name" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="onSelectionChanged"
		 @sort-change="onSortChanged" :cell-style="cellStyle" :header-cell-style="headerCellStyle" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="#" width="80" sortable="custom">
			</el-table-column>
			<el-table-column prop="code" label="产品编码" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="prod_name" label="产品名称" min-width="160" sortable="custom">
			</el-table-column>
			<el-table-column prop="prod_short_name" label="产品简称" width="140" sortable="custom">
			</el-table-column>
			<el-table-column prop="prod_type" label="类型" width="120" :formatter="formatProdType" sortable="custom">
			</el-table-column>
			<el-table-column prop="setup_date" label="成立日期" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="windup_date" label="清盘日期" width="120" sortable="custom">
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
				<el-form-item label="编码" prop="code">
					<el-input v-model="editForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="prod_name">
					<el-input v-model="editForm.prod_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简称">
					<el-input v-model="editForm.prod_short_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.prod_type">
						<el-radio class="radio" :label="1">1-自主发行</el-radio>
						<el-radio class="radio" :label="2">2-投顾</el-radio>
						<el-radio class="radio" :label="3">3-MOM</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="成立日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.setup_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="清盘日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.windup_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="起始净值日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.init_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="起始净值">
					<el-input v-model="editForm.init_nav" auto-complete="off"></el-input>
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
				<el-form-item label="编码" prop="code">
					<el-input v-model="addForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="prod_name">
					<el-input v-model="addForm.prod_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简称">
					<el-input v-model="addForm.prod_short_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="prod_type">
					<el-radio-group v-model="addForm.prod_type">
						<el-radio class="radio" :label="1">1-自主发行</el-radio>
						<el-radio class="radio" :label="2">2-投顾</el-radio>
						<el-radio class="radio" :label="3">3-MOM</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="成立日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.setup_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="清盘日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.windup_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="起始净值日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.init_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="起始净值">
					<el-input v-model="addForm.init_nav" auto-complete="off"></el-input>
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
		getProductsPage,
		addProduct,
		editProduct,
		deleteProduct,
		deleteProducts,
	} from '../api/api';

	export default {
		mixins: [util],
		
		data() {
			return {
				filters: {
					name: '',
					prod_name: '',
				},
				products: [],
				total: 0,
				page: 1,
				page_size: 15,
				sort: '',
				order: '',
				listLoading: false,
				sels: [], //列表选中列

				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					code: [{
						required: true,
						message: '请输入编码',
						trigger: 'blur'
					}],
					prod_name: [{
						required: true,
						message: '请输入产品名称',
					}],
					prod_type: [{
						required: true,
						message: '请选择产品类型',
					}],
				},
				//编辑界面数据
				editForm: {
					code: '',
					prod_name: '',
					prod_short_name: '',
				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					code: [{
						required: true,
						message: '请输入编码',
						trigger: 'blur'
					}],
					prod_name: [{
						required: true,
						message: '请输入产品名称',
					}],
					prod_type: [{
						required: true,
						message: '请选择产品类型',
					}],
				},
				//新增界面数据
				addForm: {
					
				}

			}
		},
		methods: {
			formatProdType: function(row, column) {
				if (row.prod_type == 1) return "1-自主发行";
				if (row.prod_type == 2) return "2-投顾";
				if (row.prod_type == 3) return "3-MOM";
				if (row.prod_type != null) return row.prod_type.toString() + "-未知";
				return "-未知";
			},
			formatDate: function(ctrlValue) {
				return (!ctrlValue || ctrlValue == '') ? null : util.formatDate.format(new Date(ctrlValue), 'yyyy-MM-dd');
			},
			handleCurrentChange: function(val) {
				this.page = val;
				this.getProducts();
			},
			getProducts: function() {
				let para = {
					page: this.page,
					page_size: this.page_size,
					sort: this.sort,
					order: this.order,
					code_like: this.filters.code,
					prod_name_like: this.filters.prod_name
				};
				this.listLoading = true;
				//NProgress.start();
				getProductsPage(para)
					.then((res) => {
						this.total = res.data.total;
						this.products = res.data.data;
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
					deleteProduct(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getProducts();
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
					code: '',
					prod_name: '',
					prod_short_name: '',
					init_date: new Date().format("yyyy-MM-dd"),
					init_nav: 1.0,
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
							para.setup_date = this.formatDate(para.setup_date);
							para.windup_date = this.formatDate(para.windup_date);
							para.enabled = (!para.windup_date || para.windup_date == '');
							para.init_date = this.formatDate(para.init_date);
							editProduct(para)
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
										this.getProducts();
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
							para.setup_date = this.formatDate(para.setup_date);
							para.windup_date = this.formatDate(para.windup_date);
							para.enabled = (!para.windup_date || para.windup_date == '');
							para.init_date = this.formatDate(para.init_date);
							addProduct(para)
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
										this.getProducts();
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
				this.getProducts();
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
					deleteProducts(para)
						.then((response) => {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getProducts();
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
			this.getProducts();
		}
	}
</script>

<style scoped>

</style>
