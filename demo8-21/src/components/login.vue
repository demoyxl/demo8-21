<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区 -->
			<div class="avater_box">
				<img src="../assets/logo.png" alt="头像" />
			</div>
			<!-- el-form表单区 -->
			<el-form ref="loginFormRef" :model="loginform" :rules="loginformRules" class="login_form">
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input prefix-icon="iconfont icon-touxiang" v-model="loginform.username"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input type="password" prefix-icon="iconfont icon-mima" v-model="loginform.password"></el-input>
				</el-form-item>
				<!-- 按钮区 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resetLoginForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//这是登录表单的数据绑定对象
				loginform: {
					username: 'admin',
					password: '123456'
				},
				//这是表单验证规则
				loginformRules: {
					//验证用户名规则
					username: [{
							required: true,
							message: '请输入登录名称',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 12,
							message: '长度在 5 到 12 个字符',
							trigger: 'blur'
						}
					],
					//验证密码规则
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在6到15个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//点击重置按钮，重置登录
			resetLoginForm() {
				/* console.log(this) */
				this.$refs.loginFormRef.resetFields()
			},
			//对登录进行预验证
			login() {
				this.$refs.loginFormRef.validate(async vaild => {
					/* console.log(vaild) */
					if (!vaild) return;
					//发起请求数据，判断登录成功与否
					const {data: res} = await this.$http.post('login', this.loginform);
					if (res.meta.status !== 200) return this.$message.error("登录失败！");
					this.$message.success("登录成功！");
					console.log(res);
					window.sessionStorage.setItem('token', res.data.token);
					this.$router.push('/home')
				});
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.login_container {
		height: 100%;
		background-color: #2b4b6b;
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.avater_box {
			height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			box-shadow: 0 0 10px #ddd;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
	}

	.login_form {
		position: absolute;
		bottom: 0px;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}
</style>
