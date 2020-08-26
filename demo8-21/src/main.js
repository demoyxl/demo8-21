import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入element样式表
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入全局样式表
import './assets/css/globle.css'
//导入less css预处理
import less from 'less'
//导入样式(字体)图标
import './assets/fonts/iconfont.css'
//引入全局axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$http = axios

Vue.use(less)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
