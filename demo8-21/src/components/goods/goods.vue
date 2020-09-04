<template>
	<div>
		<!-- 面包屑导航部分 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片部分 -->
		<el-card>
			<!-- 所搜添加按钮部分-->
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
						<el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddPage">添加商品</el-button>
				</el-col>
			</el-row>
				<!-- 商品的列品表格 -->
				    <el-table
				      :data="goodsList"
				      style="width: 100%" border stripe>
				      <el-table-column type="index">
				      </el-table-column>
					  <el-table-column label="商品名称" prop="goods_name"></el-table-column>
					  <el-table-column label="商品价格(元)" prop="goods_price" width="103px"></el-table-column>
					  <el-table-column label="商品重量" prop="goods_weight" width="78px"></el-table-column>
					  <el-table-column label="创建时间" prop="add_time" width="160px">
						  <template slot-scope="scope">
							  {{scope.row.add_time | dateformat}}
						  </template>
					  </el-table-column>
					  <el-table-column label="操作" width="140px">
						  <template slot-scope='scope'>
							  <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
							  <el-button icon="el-icon-delete" type="danger" size="mini" @click='delectCommodity(scope.row)'></el-button>
						  </template>
					  </el-table-column>
				    </el-table>
					<!-- 底部分页 -->
					   <el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page="queryInfo.pagenum"
					      :page-sizes="[10, 15, 20, 25]"
					      :page-size="queryInfo.pagesize"
					      layout="total, sizes, prev, pager, next, jumper"
					      :total="total">
					    </el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//查询参数列表
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				//商品列表
				goodsList:[],
				//总数居条数
				total:0,
				query:''
			}
		},
		created() {
			this.getGoodsList()
		},
		methods:{
			//根据分页获取数据
			async getGoodsList(){
				const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
				if(res.meta.status !== 200){ return this.$message.error('获取列表失败！')}
				this.goodsList = res.data.goods
				this.total = res.data.total
				console.log(this.goodsList)
				console.log(this.total)
			},
			//当pageSize改变时，方法返回最新数据
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},
			//
			handleCurrentChange(newPagenum){
				this.queryInfo.pagenum = newPagenum
				this.getGoodsList()
			},
			//点击搜索进行搜索查询
			goodsSearch(){
				this.getGoodsList()
			},
			//对商品进行删除
			async delectCommodity(row){
				console.log(row)
				const del = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(arr=>arr)
						console.log(del)
						if(del === 'cancel'){return this.$message.info('你取消了本次操作！')}
						const {data:res} = await this.$http.delete('goods/'+row.goods_id)
						if(res.meta.status !== 200){return this.$message.error('删除失败！')}
						this.$message.success('删除成功！')
						this.getGoodsList()
				
			},
			//添加商品列表部分
			goAddPage(){
				this.$router.push('/goods/add')
			}
		}
	}
</script>

<style lang="less" scoped>
	.input-with-select {
		width: 400px;
		margin-right: 20px;
	}
</style>
