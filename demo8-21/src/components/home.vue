<template>
	<div>
		<el-button type="info" @click="logout">退出按钮</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			logout() {
				window.sessionStorage.clear();
				this.$router.push('/login')
				this.$message.success("退出成功")
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
</style>
