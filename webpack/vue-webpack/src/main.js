
console.log('main.js');

import Vue from 'vue'
import App from './App.vue' // 注意要加 .vue 即：App.vue ，暂时还没装检测文件插件
// import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
//   router,
  components: { App },
  template: '<App/>'
})
