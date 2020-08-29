<template>
	<div>
		<!-- 面包屑导航栏 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<el-table :data="userlist" style="width: 100%;" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope='scope'>
						<el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope='scope'>
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
						<!-- 分配按钮 -->
						<el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="userRoles(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加Dialog对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
			<!-- Dialog主题部分-->
			<!-- 添加表单验证-->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!-- Dialog底部按钮区域-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 操作列的修改对话框 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
			<!-- 修改对话框的主题部分-->
			<el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px" @close='editFromClose()'>
				<el-form-item label="用户名">
					<el-input v-model="editFrom.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editFrom.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="editFrom.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!-- 修改对话框的底部取消和确定按钮-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 分配角色按钮弹框 -->
		<el-dialog
		  title="分配角色"
		  :visible.sync="rolesDialogVisible"
		  width="50%"
		  @close="selectClose">
		<p>当前用户：{{info.username}}</p>
		<p>当前角色：{{info.role_name}}</p>
		<p>分配新新角色：
			 <el-select v-model="SelectRolesid" placeholder='请选择'>
			    <el-option
			      v-for="item in RolesList"
			      :key="item.id"
			      :label="item.roleName"
			      :value="item.id">
			    </el-option>
			  </el-select>
		</p>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="rolesDialogVisibleCanel">取 消</el-button>
		    <el-button type="primary" @click="rolesDialogVisibleOk">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			//验证邮箱的规则
			var checkEmail = (rule, value, cb) => {
				//正则表达式验证邮箱
				const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (regEmail.test(value)) {
					return cb();
				}
				cb(new Error('请输入合法的邮箱'))
			}
			//验证电话号的规则
			var checkMobile = (rule, value, cb) => {
				//正则验证电话号码
				const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (regMobile.test(value)) {
					return cb();
				}
				cb(new Error('请输入合法的手机号'))
			}
			return {
				queryInfo: {
					query: '',
					//当前页数
					pagenum: 1,
					//当前每页显示多少条数据
					pagesize: 2
				},
				//用户数据
				userlist: [],
				//页数
				total: 0,
				//控制Dialog的显示与否
				addDialogVisible: false,
				//添加用户名表单
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				//添加用户名表单验证规则
				addFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在3到10个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在6到12个字符',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					]
				},
				//控制操作列的修改对话的显示
				editDialogVisible: false,
				//获取到的修改对话框里的原数据
				editFrom: {},
				//修改表单的验证
				editFromRules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					]	
				},
				//控制分配权限的隐藏和显示
				rolesDialogVisible:false,
				//保存本行内容，用来显示用户名称和职位描述
				info:[],
				//获取到的分配列表
				RolesList:[],
				//选中的角色id
				SelectRolesid:''
			}
		},
		mounted() {
			this.getUserList()
		},
		methods: {
			//获取数据库中的用户列表，并渲染到页面
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
				this.userlist = res.data.users
				this.total = res.data.total
				/* console.log(res) */
			},
			//监听pagesize改变的事件
			handleSizeChange(newsize) {
				/* console.log(newsize) */
				this.queryInfo.pagesize = newsize
				this.getUserList()
			},
			//监听页码改值改变的事件
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			//监听switch修改状态，修改的是数据库中的状态
			async userStateChange(userinfro) {
				console.log(userinfro)
				const {
					data: res
				} = await this.$http.put(`users/${userinfro.id}/state/${userinfro.mg_state}`);
				if (res.meta.status != 200) {
					userinfro.mg_state = !userinfro.mg_state
					return this.$message.error('修改用户状态失败')
				}
				this.$message.success('更新成功')
			},
			//关闭Dialog进行相关的回调函数
			addDialogClose() {
				this.$refs.addFormRef.resetFields()
			},
			//点击确认提交，对数据进行预校验
			addUser() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return this.$message.error('添加新用户提交失败');
					//可以添加用户网络请求
					const {
						data: res
					} = await this.$http.post('users', this.addForm)
					if (res.meta.status != 201) return this.$message.error('添加用户失败！');
					this.$message.success('添加用户成功！')
					//隐藏Dialog对话框
					this.addDialogVisible = false
					//刷新列表
					this.getUserList()
					/* console.log(res) */
				})
			},
			//点击操作栏的修改按钮，对用户信息进行修改。编辑的对话框
			async showEditDialog(id) {
				this.editDialogVisible = !this.editDialogVisible
				const {
					data: res
				} = await this.$http.get('users/' + id)
				if (res.meta.status != 200) return this.$message.error('获取用户信息失败');
				this.editFrom = res.data
				/* console.log(this.editFrom) */
			},
			//点击取消重置表单
			editFromClose(){
				this.$refs.editFromRef.resetFields()
			},
			//点击确认发起数据请求，并提交数据
			editUserInfo(){
				this.$refs.editFromRef.validate(async value=>{
					if(!value){ return}
					//发起修改用户信息的数据请求
					const {data:res} = await this.$http.put('users/'+this.editFrom.id,
					{
						email:this.editFrom.email,
						mobile:this.editFrom.mobile
						
					})
					if(res.meta.status!=200){return this.$message.error('更新失败')}
					this.$message.success(res.meta.msg)
					this.getUserList()
					this.editDialogVisible = !this.editDialogVisible
				});
			},
			//删除对话框用户列表信息
			async removeUserById(id){
				const confirmResult= await this.$confirm('此操作将永久删除用户,是否继续？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).catch(err=>err);
				//确认删除返回confirm
				//取消删除返回cancel
				if(confirmResult !== 'confirm'){return this.$message.info('你已取消删除')};
				const {data:res} = await this.$http.delete('users/'+id)
				if(res.meta.status!=200){return this.$message.error('删除失败')}
				this.$message.success(res.meta.msg)
				this.getUserList()
			},
			//控制分配角色按钮
			async userRoles(arr){
				this.info=arr
				const {data:res} = await this.$http.get('roles')
				if(res.meta.status !== 200){return this.$message.error('获取分配列表失败')}
				this.RolesList=res.data
				this.rolesDialogVisible=true
			},
			//点击Dialog取消按钮
			rolesDialogVisibleCanel(){
				this.$message.info('你取消了本次操作！')
				this.rolesDialogVisible=false
			},
			//点击Dialog确认按钮
			async rolesDialogVisibleOk(){
				if(!this.SelectRolesid){
					return this.$message.error('请选择角色！')
				}
				const {data:res} = await this.$http.put(`users/${this.info.id}/role`,{rid:this.SelectRolesid})
				if(res.meta.status !== 200){return this.$message.error('更新数据失败！')}
				this.$message.success('更新成功！')
				this.getUserList()
				this.rolesDialogVisible=false
			},
			//Dialog回调函数，重置select下拉
			selectClose(){
				this.SelectRolesid=''
				this.info=[]
			}
		}
	}
</script>
<style>
</style>
