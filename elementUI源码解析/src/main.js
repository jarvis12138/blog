// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Slider from './components/slider/index.js';
import Dialogs from './components/dialog/index.js';


// 引用Slider
Vue.use(Slider);

// 引用Dialog
Vue.use(Dialogs);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
