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
					<el-button type="primary" class="addbutton">添加分类</el-button>
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
				</tree-table>
				<!-- 页码部分 -->
			</el-row>
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
						label:'是否有效'
					}
				]
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			async getCateList(){
				const {data:res}= await this.$http.get('categories',{params: this.querInfo})
				if(res.meta.status !== 200){return this.$message.error('获取商品分类列表失败！')}
				this.$message.success('获取商品列表成功！')
				//把数据赋值给catelist
				this.catelist=res.data.result
				//把总条数数据赋值给total
				this.total=res.data.total
				console.log(this.catelist)
				console.log(this.total)
			}
		}
	}
</script>

<style lang="less" scoped>
	.addbutton{
		margin-bottom: 15px;
	}
</style>
