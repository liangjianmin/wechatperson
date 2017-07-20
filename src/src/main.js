import Vue from 'vue'
import MinUi from 'mint-ui'
import App from './App.vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import filters from './filters'
Vue.use(MinUi)
Vue.use(VueRouter)

require('../assets/css/index.css');
require('mint-ui/lib/style.css');

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

const Home = resolve => require(['./views/home.vue'], resolve)
const Person = resolve => require(['./views/Person.vue'], resolve)

const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home,
      name: '首页'
    },
    {
      path: '/person',
      component: Person,
      name: ''
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
router.afterEach((to, from, next) => {
  document.title = to.name;
})
Vue.prototype.$http = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = document.location.origin + '/';
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
