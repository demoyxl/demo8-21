<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮区域-->
			<el-row>
				<el-col>
					<el-button type="primary" @click='addRoles'>添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表区域 -->
			<el-table :data="rolelist" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',il===0 ? 'bdtop':'bdbottom','verticall']" v-for="(item,il) in scope.row.children"
						 :key="item.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRoles(scope.row,item.id)">
									{{item.authName}}
									<i class="el-icon-caret-right"></i>
								</el-tag>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<!-- 通过嵌套v-for循环 进行渲染 -->
								<el-row :class="[il2 === 0 ? '':'bdtop','verticall']" v-for="(item2,il2) in item.children" :key='item2.id'>
									<!-- 二级权限使用 -->
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRoles(scope.row,item2.id)">
											{{item2.authName}}
											<i class="el-icon-caret-right"></i>
										</el-tag>
									</el-col>
									<!-- 三级权限使用 -->
									<el-col :span="18">
										<el-row>
											<el-tag type="warning" closable v-for="(item3,il3) in item2.children" :key='item3.id' @close="removeRoles(scope.row,item3.id)">
												{{item3.authName}}
											</el-tag>
										</el-row>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!-- 索引列 -->
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="290px">
					<template slot-scope='scope'>
						<el-button type="primary" icon="el-icon-search" size="mini" @click='amendRole(scope.row.id)'>编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteRole(scope.row.id)'>删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click='showSetRigthDialog(scope.row)'>分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 添加角色按钮 -->
		<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
			<!-- 添加角色信息正文-->
			<el-form :model="addroleAnList" :rules="addrolesFormRules" ref="addrolesFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="addroleName">
					<el-input v-model="addroleAnList.addroleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="addroleDesc">
					<el-input v-model="addroleAnList.addroleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- 添加角色底部按钮-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisibleColes">取 消</el-button>
				<el-button type="primary" @click="addDialogVisibleok">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改角色权限验证信息 -->
		<el-dialog title="编辑角色" :visible.sync="rolesDialogVisible" width="50%">
			<!-- 编辑角色信息正文-->
			<el-form :model="roleAnList" :rules="rolesFormRules" ref="rolesFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="roleAnList.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="roleAnList.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- 编辑角色底部按钮-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="rolesDialogVisibleCancel">取 消</el-button>
				<el-button type="primary" @click="rolesDialogVisibleOk">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 分配权限的Dailog弹出框 -->
		<el-dialog title="分配权限" :visible.sync="showSetDialogVisible" width="50%" @close="showSetDialogVisibleTree">
			<!-- 分配正文内容-->
			<el-tree :data="rightslist" :props="treeProps" show-checkbox :default-checked-keys='treeArrayl' :default-expand-all='true'
			 node-key='id' ref='treeArr'></el-tree>
			<!-- 分配底部按钮部分-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="showSetDialogVisibleTreeCancel">取 消</el-button>
				<el-button type="primary" @click="showSetDialogVisibleTreeOk">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//所有角色列表数据
				rolelist: [],
				//添加角色按钮
				addDialogVisible: false,
				//编辑角色信息
				rolesDialogVisible: false,
				//编辑按钮form验证信息
				addrolesFormRules: {
					addroleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}, ],
					addroleDesc: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}, ]
				},
				//编辑按钮验证规则
				rolesFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}, ],
					roleDesc: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}, ]
				},
				//添加按钮
				addroleAnList: {
					addroleName: '',
					addroleDesc: ''
				},
				//获取到的修改按钮的信息
				roleAnList: {},
				//分配权限部分按钮
				showSetDialogVisible: false,
				//所有权限的信息
				rightslist: [],
				//列表树，权限分配
				treeProps: {
					label: 'authName',
					children: 'children'
				},
				//控制已勾选的选项
				treeArrayl: [],
				//获取分配权限id用以保存三级权限时使用
				huoqurolesid: ''
			}
		},
		created() {
			//获取所有角色列表数据信息
			this.getRolesList()
		},
		methods: {
			//获取角色列表信息
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败')
				}
				this.rolelist = res.data
			},
			//添加角色按钮
			addRoles() {
				this.addDialogVisible = !this.addDialogVisible
			},
			//添加的取消按钮
			addDialogVisibleColes() {
				this.addDialogVisible = !this.addDialogVisible
				this.$refs.addrolesFormRef.resetFields()
			},
			//添加的提交确定按钮
			addDialogVisibleok() {
				this.$refs.addrolesFormRef.validate(async value => {
					if (!value) return this.$message.error('添加用户失败');
					const {
						data: res
					} = await this.$http.post('roles', {
						roleName: this.addroleAnList.addroleName,
						roleDesc: this.addroleAnList.addroleDesc
					})
					if (res.meta.status != 201) {
						return this.$message.error('添加用户失败')
					}
					//提示添加成功
					this.$message.success(res.meta.msg)
					//关闭Dialog对话框 */
					this.addDialogVisible = !this.addDialogVisible
					//刷新权限列表
					this.getRolesList()
					//结束后重置表单，防止下次创建有数据
					this.$refs.addrolesFormRef.resetFields()
				})
			},
			//修改角色
			async amendRole(id) {
				//控制修改角色的显示
				this.rolesDialogVisible = !this.rolesDialogVisible
				//根据id请求对应的编辑数据
				const {
					data: res
				} = await this.$http.get('roles/' + id)
				if (res.meta.status != 200) {
					return this.$message.error('获取编辑信息失败')
				}
				this.roleAnList = res.data
				console.log(this.roleAnList)
			},
			//编辑角色的取消按钮
			rolesDialogVisibleCancel() {
				this.rolesDialogVisible = !this.rolesDialogVisible
				this.$refs.rolesFormRef.resetFields()
			},
			//编辑角色的确认按钮
			rolesDialogVisibleOk() {
				this.$refs.rolesFormRef.validate(async value => {
					if (!value) {
						return this.$message.error('角色编辑失败！')
					}
					const {
						data: res
					} = await this.$http.put('roles/' + this.roleAnList.roleId, {
						roleName: this.roleAnList.roleName,
						roleDesc: this.roleAnList.roleDesc
					})
					if (res.meta.status != 200) {
						return this.$message.error('修改角色失败！')
					}
					this.$message.success(res.meta.msg)
					//关闭Dialog对话框
					this.rolesDialogVisible = !this.rolesDialogVisible
					//刷新权限管理列表
					this.getRolesList()
				})
			},
			//删除角色
			async deleteRole(id) {
				//messageBox对话框
				const deleteRl = await this.$confirm('你将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err);
				//会返回两个值 点取消cancel，点确定confirm
				if (deleteRl !== 'confirm') {
					return this.$message.info('你取消了此操作')
				}
				const {
					data: res
				} = await this.$http.delete('roles/' + id)
				if (res.meta.status != 200) {
					return this.$message.error('删除失败')
				}
				this.$message.success('删除成功')
				this.getRolesList()
			},
			//权限管理，当点击了三级权限，进行操作
			async removeRoles(roles, rightId) {
				const reomvRl = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				//判断返回的是值
				if (reomvRl !== 'confirm') {
					return this.$message.info('你取消了删除！')
				}
				const {
					data: res
				} = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)
				if (res.meta.status != 200) {
					return this.$message.error('权限删除失败')
				}
				this.$message.success(res.meta.msg)
				//返回最新消息，重新为页面赋值
				roles.children = res.data
			},
			//控制分配权限按钮的显示与隐藏
			async showSetRigthDialog(roles) {
				//分配权限的id
				this.huoqurolesid = roles.id
				//获取所有权限数据
				const {
					data: res
				} = await this.$http.get('rights/tree')
				if (res.meta.status != 200) {
					return this.$message.error('分配权限获取失败')
				}
				this.rightslist = res.data
				console.log(this.rightslist)
				this.getLeafKeys(roles, this.treeArrayl)
				this.showSetDialogVisible = !this.showSetDialogVisible
			},
			//通过递归的形式，获取角色下所有三级权限的id，并保存defkeys数组中
			getLeafKeys(node, arr) {
				//如果当前node节点不包含children属性，则是三级节点
				if (!node.children) {
					return arr.push(node.id)
				}
				node.children.forEach(item => this.getLeafKeys(item, arr))
			},
			//对tree数组进行重置，避免数据不为空，而渲染其他组件
			showSetDialogVisibleTree() {
				this.treeArrayl = []
			},
			//点击取消权限分配按钮
			showSetDialogVisibleTreeCancel() {
				this.$message.info('你取消了本次操作')
				this.showSetDialogVisible = !this.showSetDialogVisible
			},
			//点击确认权限分配
			async showSetDialogVisibleTreeOk() {
				const keys = [
					...this.$refs.treeArr.getCheckedKeys(),
					...this.$refs.treeArr.getHalfCheckedKeys()
				]
				const idStr = keys.join(',')
				const {
					data: res
				} = await this.$http.post(`roles/${this.huoqurolesid}/rights`, {
					rids: idStr
				})
				if (res.meta.status != 200) {
					return this.$message.error('分配权限失败')
				}
				this.$message.success(res.meta.msg)
				this.getRolesList()
				this.showSetDialogVisible = !this.showSetDialogVisible
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-tag {
		margin: 7px;
	}

	.bdbottom {
		border-bottom: 1px solid #eee;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.verticall {
		display: flex;
		align-items: center;
	}
</style>
