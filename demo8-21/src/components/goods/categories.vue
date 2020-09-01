<template>
	<div>
		<!-- 顶部面包屑导航 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card>
			<!-- 添加商品分类按钮区域 -->
			<el-row>
				<el-col>
					<el-button type="primary" class="addbutton" @click='addClick'>添加分类</el-button>
				</el-col>
				<!-- 商品列表表格 -->
				<tree-table
				:data='catelist' 
				:columns='columns'
				:selection-type='false'
				:expand-type='false'
				:show-index='true'
				index-text="#"
				border
				:show-row-hover='false'>
				<!-- 是否有效 -->
				<template slot='isok' slot-scope='scope'>
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
					<i class="el-icon-error" v-else style="color: red;"></i>
				</template>
				<!-- 排序 -->
				<template slot='order' slot-scope='scope'>
					<el-tag size="mini" v-if="scope.row.cat_pid === 0">一级</el-tag>
					<el-tag size="mini" type="success" v-else-if="scope.row.cat_pid === 1">二级</el-tag>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>
				<!-- 操作 -->
				<template slot='caozuo' slot-scope='scope'>
					<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
				</template>
				</tree-table>
				<!-- 页码部分 -->
				    <el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="querInfo.pagenum"
				      :page-sizes="[5, 15, 25, 35]"
				      :page-size="100"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="total">
				    </el-pagination>
			</el-row>
			<!-- 添加分类对话框 -->
			<el-dialog
			  title="添加分类"
			  :visible.sync="addDialogVisible"
			  width="50%"
			  @close="addDialogClose">
			  <!-- 添加分类的主题内容-->
			<el-form :model="addForm" :rules="addFromRules" ref="addFromRef" label-width="90px">
			  <el-form-item label="分类名称" prop="cat_name">
			    <el-input v-model="addForm.cat_name"></el-input>
			  </el-form-item>
			  <el-form-item label="父级分类">
					 <!-- 级联-->
					  <el-cascader
						v-model="selectedOption2"
					     :options="ParentCatelist"
					     :props="caseaderProps"
					     @change="addParentCate"
						 clearable
						 ></el-cascader>
			  </el-form-item>
			</el-form>
			  <!-- 添加分类的取消和确定的点击按钮-->
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="addquxiao">取 消</el-button>
			    <el-button type="primary" @click="addCate">确 定</el-button>
			  </span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//查询条件
				querInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				//商品分类数据列表，默认为空
				catelist:[],
				//总数据条数
				total:0,
				//为table指定列
				columns:[
					{
						label:'商品分类',
						prop:'cat_name'
					},
					{
						label:'是否有效',
						//表示，将当前定义为模板列
						type:'template',
						//表示当前这一列表示的模板名称
						template:'isok'
					},
					{
						label:'排序',
						//表示，将当前定义为模板列
						type:'template',
						//表示当前这一列表示的模板名称
						template:'order'
					},
					{
						label:'操作',
						//表示，将当前定义为模板列
						type:'template',
						//表示当前这一列表示的模板名称
						template:'caozuo'
					}
				],
				//添加分类
				addDialogVisible:false,
				//添加分类表单
				addForm:{
				//添加分类的名称
				cat_name:'',
				//父级分类的id
				cat_pid:0,
				//分类层级
				cat_level:0
				},
				//添加表单的验证信息
				addFromRules:{
					cat_name:[
						 { required: true, message: '请输入分类的名称', trigger: 'blur' }
					]
				},
				//父级分类的数组
				ParentCatelist:[],
				//级联prop规则规定
				caseaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					checkStrictly:'change-on-select',
					expandTrigger:'hover'
				},
				//选中的父级分类
				selectedOption2:[]
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			async getCateList(){
				const {data:res}= await this.$http.get('categories',{params: this.querInfo})
				if(res.meta.status !== 200){return this.$message.error('获取商品分类列表失败！')}
				//把数据赋值给catelist
				this.catelist=res.data.result
				//把总条数数据赋值给total
				this.total=res.data.total
				/* console.log(this.catelist)
				console.log(this.total) */
			},
			//监听pagessize事件
			handleSizeChange(newSize){
				this.querInfo.pagesize=newSize
				this.getCateList()
			},
			//监听pagenum页码值变化
			handleCurrentChange(newpages){
				this.querInfo.pagenum=newpages
				this.getCateList()
			},
			//添加分类的点击按钮
			addClick(){
				//先获取父级分类的对话框
				this.getParentCatelist()
				//再展开对话框
				this.addDialogVisible=true
			},
			//获取父级分类的列表
			async getParentCatelist(){
				const {data:res} = await this.$http.get('categories',{params:{type:2,}})
				if(res.meta.status !== 200){
					return this.$message.error('获取父级列表失败')
				}
				this.ParentCatelist = res.data
			},
			//级联改变时触发
			addParentCate(){
				if(this.selectedOption2.length>0){
					this.addForm.cat_pid = this.selectedOption2[
						this.selectedOption2.length-1
					]
					this.addForm.cat_level=this.selectedOption2.length
					return
				}else{
					this.addForm.cat_pid=0
					this.addForm.cat_level=0
				}
				/* console.log(this.selectedOption2) */
			},
			//添加分类点击按钮确认
			addCate(){
				this.$refs.addFromRef.validate( async value=>{
					if(!value)return
					const {data:res} = await this.$http.post('categories',this.addForm)
					if(res.meta.status != 201){
						return this.$message.error('添加失败！')
					}
					this.$message.success('添加成功！')
					this.getCateList()
					this.addDialogVisible = false
				})
			},
			//取消按钮
			addquxiao(){
				this.$refs.addFromRef.resetFields()
				this.selectedOption2=[]
				this.addForm.cat_level=0
				this.addForm.cat_pid=0
				this.addDialogVisible = false
			},
			//Dialog最后的回调事件
			addDialogClose(){
				this.$refs.addFromRef.resetFields()
				this.selectedOption2=[]
				this.addForm.cat_level=0
				this.addForm.cat_pid=0
			}
		}
	}
</script>

<style lang="less" scoped>
	.addbutton{
		margin-bottom: 15px;
	}
	.el-cascader{
		width: 100%;
	}
</style>
