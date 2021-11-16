import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/plugins/vant'
import './assets/css/global.css'
import 'vant/lib/index.css'
import 'vant/lib/button/style/less'
import './assets/css/fileUp.less'
import './assets/font_040v4squrt9v/iconfont.css'

// import './assets/css/fileUp.less'




import axios from 'axios'
axios.defaults.baseURL = `http://42.193.15.69:8181`
// axios.defaults.baseURL = `http://localhost:8080`
// axios.defaults.baseURL = ` http://192.168.82.104:8080`
Vue.prototype.$http = axios;
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')