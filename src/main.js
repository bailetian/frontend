import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.component('happy-scroll', HappyScroll)
Vue.use(VueAxios, axios)

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

import './common/js/rem'

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  //
  // if(to.meta.required){
  //   if(user){
  //     next()
  //   }else{
  //     next('/login')
  //   }
  // }else{
  //   next()
  // }
  // if (!user && to.path != '/login') {
  //   next({ path: '/login' })
  // }else{
  //   next()
  // }
    if (to.path === '/') {
        const info = window.location.href.split('?')[1]
        if (info) {
            const res = {}
            info.split('&').forEach(item => {
                const objInfo = item.split('=')
                const key = objInfo[0]
                res[key] = objInfo[1]
            })
            next(`/login?${info}`)
        } else {
            next('/a45963add6c56959057c91f5b9b1d577')
        }
    } else {
      next()
    }
})

// router.afterEach(transition => {
// NProgress.done();
// });

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

