<template>
	<div>
		<!-- 面包屑导航部分 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片部分 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable='false' show-icon>
			</el-alert>
			<!-- 选择商品分类级联部分-->
			<el-row class='S-X-params'>
				<el-col>
					<span>选择商品分类:</span>
					<!-- 级联列表-->
					<el-cascader v-model="cascaderSelect" :options="cascaderList" :props="cascaderProp" @change="cascaderChange"></el-cascader>
				</el-col>
			</el-row>
			<!-- tab标签区 -->
			<el-tabs v-model="cascaderTab" @tab-click="tabHandelClick">
				<!-- 添加动态参数属性的面板-->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="Ddisabled" @click='manyOnlydialogVisible = true'>添加参数</el-button>
					<el-table :data="manyTableData" border stripe>
						<!-- 这是一个索引列 -->
						<el-table-column type="expand">
							<template slot-scope='scope'>
								<!-- 循环渲染数据 -->
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable class="tag" @close="delecTag(i,scope.row)">{{item}}</el-tag>
								<!-- 后面的tag输入 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" size="small" ref="saveTagInput"
								 @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope='scope'>
								<el-button type="primary" icon="el-icon-edit" size="small" @click='showEditDialog(scope.row)'>修改</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small" @click='delectTable(scope.row.attr_id)'>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态属性的面板 -->
				<el-tab-pane label="静态参数" name="only">
					<el-button type="primary" size="mini" :disabled="Jdisabled" @click='manyOnlydialogVisible = true'>添加属性</el-button>
					<el-table :data="onlyTableData" border stripe>
						<!-- 这是一个索引列 -->
						<el-table-column type="expand">

							<template slot-scope='scope'>
								<!-- 循环渲染数据 -->
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable class="tag" @close="delecTag(i,scope.row)">{{item}}</el-tag>
								<!-- 后面的tag输入 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
								 size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>

						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope='scope'>
								<el-button type="primary" icon="el-icon-edit" size="small" @click='showEditDialog(scope.row)'>修改</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small" @click='delectTable(scope.row.attr_id)'>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 添加属性和添加参数公用的Dialog -->
		<el-dialog :title="'添加'+titleText" :visible.sync="manyOnlydialogVisible" width="50%" @close="addDialogClosed">
			<!-- Dialog主题部分 -->
			<el-form :model="manyOnlyForm" :rules="manyOnlyRules" ref="manyOnlyRef" label-width="80px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="manyOnlyForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部按钮 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="manyOnlydialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑对话框的Dialog -->
		<el-dialog :title="titleText" :visible.sync="showEditDialogVisible" width="50%" @close="editDialogClose">
			<!-- Dialog的主题部分 -->
			<el-form :model="editForm" :rules="editRules" ref="editRef" label-width="80px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showEditDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editDialogOk">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//获取到的所有商品数据
				cascaderList: [],
				//级联规则
				cascaderProp: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children',
					expandTrigger: 'hover'
				},
				//选中的商品
				cascaderSelect: [],
				//被激活的tab标签页
				cascaderTab: 'many',
				//动、静态添加按钮的禁用
				Ddisabled: true,
				Jdisabled: true,
				//many和only获取到的数据
				manyTableData: [],
				onlyTableData: [],
				//控制Dialog的显示与隐藏
				manyOnlydialogVisible: false,
				//manyOnly对话框里面的form表单
				manyOnlyForm: {},
				//manyOnly对话框里面的form表单验证规则
				manyOnlyRules: {
					attr_name: [{
						required: true,
						message: "请填写参数属性",
						trigger: 'blur'
					}]
				},
				//控制编辑对话框隐藏与否
				showEditDialogVisible: false,
				//编辑按钮的表单
				editForm: {},
				//编辑按钮的表单验证规则
				editRules: {
					attr_name: [{
						required: true,
						message: "请填写参数属性",
						trigger: 'blur'
					}, ]
				}
			}
		},
		created() {
			this.getCommodityList()
		},
		methods: {
			//获取所有商品列表
			async getCommodityList() {
				const {
					data: res
				} = await this.$http.get('categories')
				if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
				this.cascaderList = res.data
				/* console.log(this.cascaderList) */
			},
			//级联改变时触发的事件
			cascaderChange() {
				this.getParamsData()
			},
			async getParamsData() {
				if (this.cascaderSelect.length !== 3) {
					this.cascaderSelect = []
					this.manyTableData = []
					this.onlyTableData = []
					this.Ddisabled = true
					this.Jdisabled = true
					return
				}
				this.Ddisabled = false
				this.Jdisabled = false
				/* console.log(this.cascaderSelect) */
				//根据所选的Id分类，和当前的所处面板，获取对应的参数
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: {
						sel: this.cascaderTab
					}
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取属性信息失败！')
				}
				/* console.log(res.data) */
				if (this.cascaderTab === 'many') {
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
						item.inputVisible = false
						item.inputValue = ''
					})
					/* console.log(res.data) */
					this.manyTableData = res.data
				} else {
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
						item.inputVisible = false
						item.inputValue = ''
					})
					this.onlyTableData = res.data
				}
			},
			//tab的标签页的点击事件
			tabHandelClick() {
				/* console.log(this.cascaderTab) */
				this.getParamsData()
			},
			//监听Dialog的关闭事件
			addDialogClosed() {
				this.$refs.manyOnlyRef.resetFields()
			},
			//点击添加按钮对数据进行添加
			addParams() {
				this.$refs.manyOnlyRef.validate(async vaild => {
					if (!vaild) {
						return
					}
					const {
						data: res
					} = await this.$http.post(`categories/${this.cateId}/attributes`, {
						attr_name: this.manyOnlyForm.attr_name,
						attr_sel: this.cascaderTab
					})
					if (res.meta.status !== 201) return this.$message.error('添加数据失败！')
					this.$message.success('添加数据成功！')
					this.manyOnlydialogVisible = false
					this.getParamsData()
				})

			},
			//点击显示修改Dialog可以对信息进行修改
			async showEditDialog(arr) {
				/* console.log(arr) */
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateId}/attributes/${arr.attr_id}`, {
					params: {
						attr_sel: this.cascaderTab
					}
				})
				if (res.meta.status != 200) {
					return this.$message.error('获取分类参数信息失败！')
				}
				this.editForm = res.data
				/* console.log(this.editForm) */
				this.showEditDialogVisible = true
			},
			//编辑表单的回调函数
			editDialogClose() {
				this.$refs.editRef.resetFields()
			},
			//编辑表单的确认按钮
			editDialogOk() {
				this.$refs.editRef.validate(async vaild => {
					if (!vaild) {
						return
					}
					const {
						data: res
					} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name,
						attr_sel: this.editForm.attr_sel
					})
					if (res.meta.status !== 200) {
						return this.$message.error('修改参数分类失败！')
					}
					this.$message.success('更新成功！')
					this.getParamsData()
				})
				this.showEditDialogVisible = false
			},
			//数据删除按钮的点击操作
			async delectTable(attr_id) {
				const delectCT = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(arr => arr)
				/* console.log(delectCT) */
				if (delectCT === 'cancel') {
					return this.$message.info('你取消了本次操作！')
				}
				const {
					data: res
				} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
				if (res.meta.status !== 200) {
					return this.$message.error('删除失败！')
				}
				this.$message.success('删除成功！')
				this.getParamsData()
			},
			//tag相关的显示，失去焦点等的操作
			async handleInputConfirm(row) {
				if (row.inputValue.trim().length === 0) {
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				//如果没有return,则证明输入的值有效，就要进行后续的处理
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue = ''
				row.inputVisible = false
				this.saveSql(row)
			},
			//把对attr_id的操作保存到数据库
			async saveSql(row) {
				//发起网络请求，保存到数据库中
				const {
					data: res
				} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(',')
				})
				if (res.meta.status !== 200) {
					return this.$message.error('添加失败！')
				}
				this.$message.success('修改参数成功！')
				/* console.log('ok') */
			},
			//tag标签的显示与否。
			showInput(row) {
				row.inputVisible = true
				//让文本框自动获得焦点
				//$nextTick 方法的作用，当页面重新渲染后才会指定调用函数中的代码
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			//点击tag后面的删除按钮，对删除进行操作
			delecTag(i, row) {
				row.attr_vals.splice(i, 1)
				this.saveSql(row)
			}
		},
		computed: {
			cateId() {
				if (this.cascaderSelect.length === 3) {
					return this.cascaderSelect[2]
				}
				return null
			},
			//动态计算
			titleText() {
				if (this.cascaderTab === 'many') {
					return '动态参数'
				} else {
					return '静态属性'
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.S-X-params {
		margin-top: 15px;
	}

	.el-cascader {
		margin-left: 15px;
	}

	.tag {
		margin-left: 5px;
		margin-right: 5px;
		margin-top: 5px;
	}

	.input-new-tag {
		margin-top: 5px;
		width: 120px;
	}
</style>
