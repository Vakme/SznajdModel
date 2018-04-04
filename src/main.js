import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import terra from 'terra'

Vue.use(BootstrapVue);
Vue.prototype.$terra = terra;


new Vue({
  el: '#app',
  render: h => h(App)
})
