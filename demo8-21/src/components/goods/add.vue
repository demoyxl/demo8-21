<template>
	<div>
		<!-- 面包屑导航部分 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片部分 -->
		<el-card>
			<!-- 消息提示区 -->
			<el-alert title="添加商品信息" type="info" :center='true' :closable='false' show-icon>
			</el-alert>
			<!-- 步进条部分-->
			<el-steps :space="200" :active="activIndex-0" finish-status="success" class="mysteps" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- tabs主题内容部分-->
			<el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px" label-position='top'>

				<el-tabs v-model="activIndex" 
				tab-position='left' 
				style="margin-top: 15px;" 
				:before-leave='beforTabLeave'
				@tab-click="tabclick">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>
						<!-- 级联选择器 -->
						
						<el-cascader
						    v-model="addForm.goods_cat"
						    :options="catelist"
						    :props="cateProps"
						    @change="handleChange"></el-cascader>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key='item.attr_id'>
							<el-checkbox-group v-model="item.attr_vals">
							    <el-checkbox border :label="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
							  </el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- action是指上传到后台api的地址 -->
						<el-upload
						  action="http://127.0.0.1:8888/api/private/v1/upload"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  list-type="picture"
						  :headers="headersObj"
						  :on-success="handleSuccess">
						  <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!-- 富文本编辑器组件 -->
						 <quill-editor v-model="addForm.goods_introduce">
							 
						 </quill-editor>
						 <!-- 添加商品的按钮-->
						 <el-button type="primary" class="addbutton" @click="add">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>

		</el-card>
		<!-- 图片预览 -->
		
		<el-dialog
		  title="图片预览"
		  :visible.sync="preiewVisible"
		  width="50%">
			<img :src="previewPath" class="preiewimg" />
		</el-dialog>
		
		
	</div>
</template>

<script>
	import _ from 'lodash'
	export default {
		data() {
			return {
				//步进条
				activIndex: 0,
				//步进条的form
				addForm: {
					goods_name:'',
					goods_price:0,
					goods_weight:0,
					goods_number:0,
					//商品所属的分类数组
					goods_cat:[],
					//上传图片成功时，保存图片的临时路径
					pics:[],
					//商品的详情信息介绍
					goods_introduce:'',
					//动态参数和静态属性
					attrs:[]
				},
				//表单的验证规则
				addRules: {
					goods_name:[
						  { required: true, message: '请输入商品名称', trigger: 'blur' }
					],
					goods_price:[
						 { required: true, message: '请输入商品价格', trigger: 'blur' }
					],
					goods_weight:[
						 { required: true, message: '请输入商品重量', trigger: 'blur' }
					],
					goods_number:[
						 { required: true, message: '请输入商品数量', trigger: 'blur' }
					]
				},
				//级联列表数据
				catelist:[],
				//级联规则
				cateProps:{
					expandTrigger:'hover',
					label:'cat_name',
					children:'children',
					value:'cat_id'
				},
				//商品参数列表数据
				manyTableData:[],
				//静态属性参数列表
				onlyTableData:[],
				//图片上传时的请求头
				headersObj:{Authorization : window.sessionStorage.getItem('token')},
				previewPath:'',
				//预览的显示与隐藏
				preiewVisible:false
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			async getCateList(){
				const {data:res} = await  this.$http.get('categories')
				if(res.meta.status !== 200){return this.$message.error('获取列表失败！')}
				this.catelist=res.data
				console.log(this.catelist)
			},
			//级联改变时触发
			handleChange(){
				if(this.addForm.goods_cat.length !== 3){
					this.addForm.goods_cat=[]
				}
				console.log(this.addForm.goods_cat)
			},
			//切换标签页时触发
			beforTabLeave(activeName,oldActive){
				/* console.log("即将离开的标签页："+oldActive)
				console.log("要进入的标签页："+activeName) */
				if(oldActive === '0' && this.addForm.goods_cat.length !== 3){
					this.$message.error('请选择商品分类！')
					return false
				}
			},
			//点击要进入的tabs标签要请求的数据
			async tabclick(){
				if(this.activIndex === "1"){
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
					if(res.meta.status !== 200){return }
					res.data.forEach(item=>{
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
					})
					this.manyTableData = res.data
					/* console.log(this.manyTableData) */
				}else if(this.activIndex == '2'){
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
					if(res.meta.status !== 200){return }
					this.onlyTableData = res.data
					console.log(this.onlyTableData)
					
				}
			},
			//处理图片预览
			handlePreview(file){
				console.log(file)
				this.previewPath = file.response.data.url
				this.preiewVisible = true
			},
			//移除图片时触发的
			handleRemove(file){
				/* console.log(file) */
				//拿到临时存放的路径
				const rempath=file.response.data.tmp_path
				//根据值查询数组存放的索引
				const i = this.addForm.pics.findIndex(x=>{
					x.pic === rempath
				})
				//移除数据
				this.addForm.pics.splice(i,1)
				/* console.log(this.addForm) */
			},
			//监听图片上传成功
			handleSuccess(response){
				/* console.log(response) */
				//1、拼接得到一个图片信息对象
				const picsInfo={pic:response.data.tmp_path}
				//2、将图片信息对象，push到pics数组中
				this.addForm.pics.push(picsInfo)
				/* console.log(this.addForm.pics) */
			},
			//添加商品的提交按钮
			add(){
				this.$refs.addRef.validate(async valid=>{
					if(!valid){return this.$message.error('表单验证失败！')}
					//验证成功，执行添加的业务逻辑
					const form = _.cloneDeep(this.addForm)
					form.goods_cat = form.goods_cat.join(',')
					//处理动态参数
					this.manyTableData.forEach(item=>{
						const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
						this.addForm.attrs.push(newInfo)
					})
					//静态属性
					this.onlyTableData.forEach(item=>{
						const newinfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
						this.addForm.attrs.push(newinfo)
					})
					form.attrs = this.addForm.attrs
					console.log(form)
					//发起请求添加商品
					//商品的名称，必须是唯一的
					const {data:res} = await this.$http.post('goods',form)
					if(res.meta.status !== 201){return this.$message.error("商品添加失败！")}
					this.$message.success("商品添加成功！")
					this.$router.push('/goods')
				})
			}
		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2]
				}
				return null
			}
		}
	}
</script>

<style lang="less" scoped>
	.mysteps {
		margin-top: 20px;
	}
	.el-checkbox{
		margin: 0 10px 0 0!important;
	}
	.preiewimg{
		width: 100%;
	}
	.addbutton{
		margin-top: 20px;
	}
</style>
