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
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表区域 -->
			<el-table :data="rolelist" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',il===0 ? 'bdtop':'bdbottom']" v-for="(item,il) in scope.row.children" :key="item.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag>
									{{item.authName}}
									<i class="el-icon-caret-right"></i>
								</el-tag>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<!-- 通过嵌套v-for循环 进行渲染 -->
								<el-row :class="[il2 === 0 ? '':'bdtop']" v-for="(item2,il2) in item.children" :key='item2.id'>
									<!-- 二级权限使用 -->
									<el-col :span="6">
										<el-tag type="success">
											{{item2.authName}}
											<i class="el-icon-caret-right"></i>
										</el-tag>
									</el-col>
									<!-- 三级权限使用 -->
									<el-col :span="18">
										<el-row>
												<el-tag type="warning" v-for="(item3,il3) in item2.children" :key='item3.id'>
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
						<el-button type="primary" icon="el-icon-search" size="mini">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//所有角色列表数据
				rolelist: []
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
				console.log(this.rolelist)
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
</style>
