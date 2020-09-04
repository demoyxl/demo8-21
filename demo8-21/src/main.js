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
//导入tree-table
import treeTable from 'vue-table-with-tree-grid'
//导入vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// require styles 编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$http = axios
//时间过滤器
Vue.filter('dateformat',function(originVal){
	const dt = new Date(originVal)
	const y = dt.getFullYear()
	const m = (dt.getMonth()+1+"").padStart(2,'0')
	const d = (dt.getDate()+'').padStart(2,'0')
	
	const hh = (dt.getHours()+'').padStart(2,'0')
	const mm = (dt.getMinutes()+'').padStart(2,'0')
	const ss = (dt.getSeconds()+'').padStart(2,'0')
	
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(less)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.component('tree-table',treeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
