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
			 <el-alert
			    title="注意:只允许为第三级分类设置相关参数!"
			    type="warning"
				:closable='false'
			    show-icon>
			  </el-alert>
			  <!-- 选择商品分类级联部分-->
			  <el-row class='S-X-params'>
				  <el-col>
					  <span>选择商品分类:</span>
					    <!-- 级联列表-->
				 <el-cascader
				      v-model="cascaderSelect"
				      :options="cascaderList"
				      :props="cascaderProp"
				      @change="cascaderChange"></el-cascader>
				  </el-col>
			  </el-row>
			  <!-- tab标签区 -->
			  <el-tabs v-model="cascaderTab" @tab-click="tabHandelClick">
				  <!-- 添加动态参数属性的面板-->
			    <el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="Ddisabled" @click='manyOnlydialogVisible = true'>添加参数</el-button>
					<el-table :data="manyTableData" border stripe>
						<!-- 这是一个索引列 -->
						<el-table-column type="expand"></el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope='scope'>
								<el-button type="primary" icon="el-icon-edit" size="small">修改</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态属性的面板 -->
			    <el-tab-pane label="静态参数" name="only">
					<el-button type="primary" size="mini" :disabled="Jdisabled" @click='manyOnlydialogVisible = true'>添加属性</el-button>
					<el-table :data="onlyTableData" border stripe>
						<!-- 这是一个索引列 -->
						<el-table-column type="expand"></el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope='scope'>
								<el-button type="primary" icon="el-icon-edit" size="small">修改</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			  </el-tabs>
		</el-card>
		<!-- 添加属性和添加参数公用的Dialog -->
		<el-dialog
		  :title="'添加'+titleText"
		  :visible.sync="manyOnlydialogVisible"
		  width="50%" 
		  @close="addDialogClosed">
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
	</div>
</template>

<script>
	export default{
		data() {
			return {
				//获取到的所有商品数据
				cascaderList:[],
				//级联规则
				cascaderProp:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					expandTrigger:'hover'
				},
				//选中的商品
				cascaderSelect:[],
				//被激活的tab标签页
				cascaderTab:'many',
				//动、静态添加按钮的禁用
				Ddisabled:true,
				Jdisabled:true,
				//many和only获取到的数据
				manyTableData:[],
				onlyTableData:[],
				//控制Dialog的显示与隐藏
				manyOnlydialogVisible:false,
				//manyOnly对话框里面的form表单
				manyOnlyForm:{},
				//manyOnly对话框里面的form表单验证规则
				manyOnlyRules:{
					attr_name:[
						{ required: true, message:"请填写参数属性", trigger:'blur' }
					]
				}
			}
		},
		created() {
			this.getCommodityList()
		},
		methods:{
			//获取所有商品列表
			async getCommodityList(){
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
				this.cascaderList=res.data
				/* console.log(this.cascaderList) */
			},
			//级联改变时触发的事件
			cascaderChange(){
				this.getParamsData()
			},
			async getParamsData(){
				if(this.cascaderSelect.length !== 3){
					this.cascaderSelect=[]
					this.Ddisabled=true
					this.Jdisabled=true
					return 
				}
				this.Ddisabled=false
				this.Jdisabled=false
				/* console.log(this.cascaderSelect) */
				//根据所选的Id分类，和当前的所处面板，获取对应的参数
				const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.cascaderTab}})
				if(res.meta.status !== 200){
					return this.$message.error('获取属性信息失败！')
				}
				/* console.log(res.data) */
				if(this.cascaderTab === 'many'){
					this.manyTableData = res.data
				}else{
					this.onlyTableData = res.data
				}
			},
			//tab的标签页的点击事件
			tabHandelClick(){
				/* console.log(this.cascaderTab) */
				this.getParamsData()
			},
			//监听Dialog的关闭事件
			addDialogClosed(){
				this.$refs.manyOnlyRef.resetFields()
			},
			//点击添加按钮对数据进行添加
			addParams(){
				this.$refs.manyOnlyRef.validate(async vaild=>{
					if(!vaild){return }
					const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.manyOnlyForm.attr_name,attr_sel:this.cascaderTab})
					if(res.meta.status !== 201)return this.$message.error('添加数据失败！')
					this.$message.success('添加数据成功！')
					this.manyOnlydialogVisible=false
					this.getCommodityList()
				})
			}
		},
		computed:{
			cateId(){
				if(this.cascaderSelect.length === 3){
					return this.cascaderSelect[2]
				}
				return null
			},
			//动态计算
			titleText(){
				if(this.cascaderTab === 'many'){
					return '动态参数'
				}else{
					return '静态属性'
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.S-X-params{
		margin-top: 15px;
	}
	.el-cascader{
		margin-left: 15px;
	}
</style>
