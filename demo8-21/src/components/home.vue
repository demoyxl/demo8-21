<template>
	<el-container class="home_container">
		<!-- 头布局 -->
		<el-header>
			<div>
				<img src="../assets/logo.png" alt="图标" class="img_img">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出按钮</el-button>
		</el-header>
		<!-- 页面主体布局 -->
		<el-container>
			<!-- 左侧主题布局 -->
			<el-aside :width="iscollapse ? '64px' : '200px'">
				<!-- 收起展开按钮 -->
				<div class="togger_button" @click="toggleCollapest">|||</div>
				<!-- 自定义菜单栏 侧边栏菜单区 -->
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
				 unique-opened :collapse="iscollapse"
				 :collapse-transition="false"
				 router
				 :default-active="activePath">
					<!--一级菜单-->
					<el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
						<!-- 一级菜单的模板区域 -->
						<template slot="title">
							<!-- 图标 -->
							<i :class="iconlist[item.id]"></i>
							<!-- 文本 -->
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
						@click="saveNavState('/'+subItem.path)">
							<template slot="title">
								<!-- 图标 -->
								<i class="el-icon-menu"></i>
								<!-- 文本 -->
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 右侧主题内容 -->
			<el-main>
				<!--路由占位符-->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				//左侧菜单属性
				menulist: [],
				iconlist: {
					'125': 'iconfont icon-icon-user-default',
					'103': 'iconfont icon-icon_-',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-icon-test',
					'145': 'iconfont icon-baobiao'
				},
				//点击展开或收缩
				iscollapse: false,
				//点击当前激活菜单的 index
				activePath:''
			}
		},
		created() {
			this.getMenuList()
			this.activePath=window.sessionStorage.getItem('activePath')
		},
		methods: {
			logout() {
				window.sessionStorage.clear();
				this.$router.push('/login')
				this.$message.success("退出成功")
			},
			//获取后台所有菜单
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')

				if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.menulist = res.data
				/* console.log(res.data) */
			},
			//点击收起展开左边菜单栏
			toggleCollapest() {
				this.iscollapse = !this.iscollapse
			},
			//保存链接的激活状态
			saveNavState(activePath){
				window.sessionStorage.setItem("activePath",activePath)
				this.activePath=activePath
			}
			
		}
	}
</script>

<style lang="less" scoped="scoped">
	.home_container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		padding-left: 0;
		color: #fff;
		font-size: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}
		}

		.img_img {
			width: 52px;
			height: 52px;
			border-radius: 50%;
			padding: 3px;
			background-color: #fff;
			opacity: 0.5;
		}
	}

	.el-aside {
		background-color: #333744;

		.el-menu {
			border-right: none;
		}
	}

	.el-main {
		background-color: #EAEDF1;
	}

	.iconfont {
		margin-right: 10px;
	}

	.togger_button {
		background-color: #4A5064;
		color: #fff;
		font-size: 10px;
		line-height: 24px;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
