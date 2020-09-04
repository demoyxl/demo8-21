<template>
	<div>
		<!-- 面包屑导航部分 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>
			<el-row>
				<el-col :span="8">
					 <el-input placeholder="请输入内容" class="input-with-select">
					    <el-button slot="append" icon="el-icon-search"></el-button>
					  </el-input>
				</el-col>
			</el-row>
			<!-- 订单列表 -->
			<el-table :data="goodsOrdesList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="订单编号" prop="order_number"></el-table-column>
				<el-table-column label="订单价格" prop="order_price" width="80px"></el-table-column>
				<el-table-column label="是否付款" prop="pay_status" width="80px">
					<template slot-scope='scope'>
						<el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
						<el-tag type="success" v-else>已付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否发货" prop="is_send" width="80px"></el-table-column>
				<el-table-column label="下单时间" prop="create_time" width="180px">
					<template slot-scope='scope'>
						{{scope.row.create_time | dateformat}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120px">
					<template slot-scope='scope'>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click='editClick'></el-button>
						<el-button type="success" icon="el-icon-location-outline" size="mini"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 标签页 -->
			 <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :page-sizes="[5, 10, 20, 30]"
			      :page-size="querInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
		<!-- 点击编辑弹出来的对话框 -->
		<el-dialog
		  title="修改地址"
		  :visible.sync="editDialogVisible"
		  width="50%">
		 <!-- 修改的主题部分-->
		 <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px" class="demo-ruleForm">
		   <el-form-item label="省市区/县" prop="address1">
		     <el-input v-model="addForm.address1"></el-input>
		   </el-form-item>
		   <el-form-item label="详细地址" prop="address2">
		     <el-input v-model="addForm.address2"></el-input>
		   </el-form-item>
		 </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				querInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				//总页数
				total:0,
				//获取到的商品列表数据
				goodsOrdesList:[],
				//控制编辑对话框的显示与隐藏
				editDialogVisible:false,
				//编辑表单
				addForm:{
					address1:'',
					address2:''
				},
				//编辑表单的验证
				addRules:{
					address1:[
						 { required: true, message: '请选择省市区县', trigger: 'blur' }
					],
					address2:[
						 { required: true, message: '请输入详细地址', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			this.getOrderList()
		},
		methods:{
			async getOrderList(){
				const {data:res} = await this.$http.get('orders',{params:this.querInfo})
				if(res.meta.status !== 200){return this.$message.error('获取数据失败！')}
				this.goodsOrdesList = res.data.goods
				this.total = res.data.total 
				console.log(res)
				console.log(this.goodsOrdesList)
			},
			//当显示页数改变时触发
			handleSizeChange(newpagesize){
				this.querInfo.pagesize = newpagesize
				this.getOrderList()
			},
			//当跳转页码变化时触发
			handleCurrentChange(newpagenum){
				this.querInfo.pagenum = newpagenum
				this.getOrderList()
			},
			//编辑对话框的显示与隐藏
			editClick(){
				this.editDialogVisible = true
			}
		}
	}
</script>

<style>
</style>
