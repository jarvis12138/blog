
toast.vue

```html
<template>
  <div class="e-toast">
    <div class="mask"></div>
    <div class="content">{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "toast",
  created() {
    let that = this;
    // setTimeout(() => {
    // that.$el.parentNode.removeChild(that.$el);
    // }, 2000);
  }
};
</script>

<style scoped>
.e-toast {
  position: fixed;
  bottom: 2px;
  left: 50%;
  overflow: hidden;
  font-size: 12px;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  border-radius: 4px;
  color: #fff;
  max-width: 80%;

  -webkit-transition: all 0.2s cubic-bezier(0.22, 1.43, 1, 1.09);
  -o-transition: all 0.2s cubic-bezier(0.22, 1.43, 1, 1.09);
  -ms-transition: all 0.2s cubic-bezier(0.22, 1.43, 1, 1.09);
  -moz-transition: all 0.2s cubic-bezier(0.22, 1.43, 1, 1.09);
  transition: all 0.2s cubic-bezier(0.22, 1.43, 1, 1.09);
}
.e-toast.show {
  bottom: 60px;
}
.e-toast.hidden {
  bottom: 0;
  opacity: 0;
  -webkit-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  -ms-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}
.e-toast .mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* opacity: 0.6; */
  background-color: rgb(77, 77, 77);
}
.e-toast .content {
  position: relative;
  color: #fff;
  word-wrap: break-word;
  font-size: 12px;
  padding: 8px 10px;
  line-height: 22px;
}
</style>
```

index.js

```js

import Vue from 'vue';
import ToastComponent from './toast.vue';

const ToastConstructor = Vue.extend(ToastComponent);

// 一个页面内同时多个弹窗(toast),组成一个数组
let toasts = [];
let timer = null;

const Toast = (message) => {
    let i = parseInt(getMaxZindex()) + 1;
    let instance = new ToastConstructor({
        data: {
            message: message
        }
    });
    instance.vm = instance.$mount();
    instance.dom = instance.vm.$el;
    document.getElementsByTagName('body')[0].appendChild(instance.dom);
    instance.dom.style.zIndex = i;
    setTimeout(() => {
        instance.dom.className = instance.dom.className + ' show';
    }, 0);

    // 先进先出 FIFO
    toasts.unshift(instance.dom);
    clearInterval(timer);
    timer = setInterval(() => {
        let removeToast = toasts.shift();
        if (!removeToast) {
            clearInterval(timer);
        } else {
            setTimeout(() => {
                removeToast.parentNode.removeChild(removeToast);
            }, 200);
            removeToast.className = removeToast.className + ' hidden';
        }
    }, 2000);

    return instance.vm;

};

function getStyle(element, css) {
    var elementStyle = window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle;
    var elementCss = elementStyle.getPropertyValue ? elementStyle.getPropertyValue(css) : elementStyle.getAttribute(css);   // getPropertyValue、getAttribute都支持 "background-color" 写法（不考虑IE6）

    return elementCss;
}

function getMaxZindex() {
    let maxZindex = 0;
    let elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
        let zindex = getStyle(elements[i], 'z-index');
        // zindex = zindex === 'auto' ? 0 : zindex;
        zindex = isNaN(parseInt(zindex)) ? 0 : parseInt(zindex);
        if (zindex > maxZindex) { maxZindex = zindex; }
    }

    return maxZindex;
}

export default {
    install: Vue => {
        Vue.prototype.$toast = Toast;
    }
}
```

main.js

```js
import Toast from '../../components/Toast/index.js';
Vue.use(Toast);
```

