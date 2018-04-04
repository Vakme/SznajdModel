import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Snotify from 'vue-snotify';
import 'vue-snotify/styles/material.css';

Vue.use(BootstrapVue);
Vue.use(Snotify);


new Vue({
  el: '#app',
  render: h => h(App)
})
