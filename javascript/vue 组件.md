
toast

```html
// toast.vue
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

```js
// index.js
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

```js
// main.js
import Toast from '../../components/Toast/index.js';
Vue.use(Toast);
```

modal

```html
// modal.vue
<template>
  <div :style="style" v-show="visible" class="e-modal">
    <div v-if="mask" @click="handleClose" class="mask"></div>
    <div :class="wrapClass" :style="wrapStyle" class="wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  data() {
    return {
      style: {
        'z-index': this.getMaxZindex() + 1
      }
    };
  },
  props: {
    visible: {
      type: Boolean
    },
    mask: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function
    },
    wrapClass: {
      type: String
    },
    wrapStyle: {
      type: Object
    }
  },
  methods: {
    getStyle(element, css) {
      var elementStyle = window.getComputedStyle
        ? window.getComputedStyle(element, null)
        : element.currentStyle;
      var elementCss = elementStyle.getPropertyValue
        ? elementStyle.getPropertyValue(css)
        : elementStyle.getAttribute(css); // getPropertyValue、getAttribute都支持 "background-color" 写法（不考虑IE6）

      return elementCss;
    },

    getMaxZindex() {
      let maxZindex = 0;
      let elements = document.getElementsByTagName("*");

      for (let i = 0; i < elements.length; i++) {
        let zindex = this.getStyle(elements[i], "z-index");
        // zindex = zindex === 'auto' ? 0 : zindex;
        zindex = isNaN(parseInt(zindex)) ? 0 : parseInt(zindex);
        if (zindex > maxZindex) {
          maxZindex = zindex;
        }
      }

      return maxZindex;
    },

    handleClose() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },

    hide() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.style['z-index'] = this.getMaxZindex() + 1;
      }
    }
  }
};
</script>

<style scoped>
.e-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.e-modal .mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.3;
  background-color: #373737;
}
.e-modal .wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  background-color: #ffffff;
  border-radius: 4px;
  overflow: hidden;

  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
```

```js
// index.js
import modalComponent from './modal.vue';

const Modal = {
    install: function(Vue) {
        Vue.component('Modal', modalComponent);
    }
};

export default Modal;
```

```js
// main.js
import Modal from '../../components/Modal/index.js';
Vue.use(Modal);
```

```html
// 调用
    <Modal :mask="false" :wrap-style="{'margin': '10px'}" :wrap-class="msg" :before-close="handleClose" :visible.sync="show2">
          <h2>Essential Links</h2>
          <h2>Essential Links</h2>
    </Modal>
```

MScroll

```js

export default function MScroll(options) {
    this.el = options.el;
    this.isGlobalScroll = options.isGlobalScroll || true;
    this.wrapperHeight; // 滚动盒子高度
    this.contentHeight; // 可视区高度
    this.wrapperScrollTop; // 滚动高度
    this.enablePulldownScroll = false; // 是否开启下拉刷新
    this.pulldownScroll = options.pulldownScroll; // 下拉刷新函数
    this.isPulldownScroll = false; // 是否正在下拉刷新
    this.distance = 80; // 下拉距离触发刷新函数
    this.point = {};
    this.enablePullupScroll = true; // 是否开启上拉加载更多
    this.pullupScroll = options.pullupScroll; // 上拉加载函数
    this.isPullupScroll = false; // 是否正在加载更多

    this.init();

}

MScroll.prototype.init = function () {
    var _this = this;

    // 下拉刷新
    _this.initPulldownScroll();

    _this.throttleScroll = throttle(function () {
        if (!_this.enablePullupScroll) {
            // 关闭监听滚动，上拉加载完所有数据
            // _this.el.removeEventListener('scroll');
            _this.destroy();
            return false;
        } else {
            _this.reLayout(); // 刷新视图
            if (!_this.isPullupScroll && _this.isBottom()) {
                _this.isPullupScroll = true;
                _this.pullupScroll();
            }
        }
    }, 200);

    _this.listenerScroll();
    // _this.reset();

};


MScroll.prototype.initPulldownScroll = function () {
    var _this = this;

    if (!_this.enablePulldownScroll) return;

    _this.touchstartEvent = function (e) {
        e.preventDefault();
        _this.reLayout();
        if (_this.wrapperScrollTop <= 0) {
            _this.point.start = _this.getPoint(e);
        }
    };

    _this.el.addEventListener('touchstart', _this.touchstartEvent);

    _this.touchmoveEvent = function (e) {
        e.preventDefault();

        var moveY = _this.getPoint(e).y - _this.point.start.y;

        if (moveY > 0 && !_this.isPulldownScroll) {
            _this.el.style.transform = 'translateY(' + moveY + 'px)';
            if (moveY < _this.distance) {
                _this.moveType = 1;
            } else if (moveY >= _this.distance) {
                _this.moveType = 2;
            }
        }
    };

    _this.el.addEventListener('touchmove', _this.touchmoveEvent);

    _this.touchendEvent = function (e) {
        e.preventDefault();
        _this.moveType = 1;
        _this.pulldownScroll();
    };

    _this.el.addEventListener('touchend', _this.touchendEvent);

};

MScroll.prototype.getPoint = function (e) {
    return {
        x: e.touches ? e.touches[0].pageX : e.clientX,
        y: e.touches ? e.touches[0].pageY : e.clientY
    };
};

MScroll.prototype.destroy = function () {
    this.el.removeEventListener('touchstart', this.touchstartEvent);
    this.el.removeEventListener('touchmove', this.touchmoveEvent);
    this.el.removeEventListener('touchend', this.touchendEvent);

    this.removeScroll();
};

MScroll.prototype.reLayout = function () {
    if (this.isGlobalScroll) {
        this.wrapperHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        this.contentHeight = window.innerHeight;
        this.wrapperScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    } else {
        this.wrapperHeight = this.el.children[0].getBoundingClientRect().height;
        this.contentHeight = this.el.getBoundingClientRect().height;
        this.wrapperScrollTop = this.el.scrollTop;
    }
};

// 是否有滚动条，文档高度大于可视区高度
MScroll.prototype.enableScroll = function () {
    if (this.wrapperHeight > this.contentHeight) {
        return true;
    } else {
        return false;
    }
};

// 是否到达底部，可以加载更多
MScroll.prototype.isBottom = function () {
    return this.wrapperHeight - 10 < this.contentHeight + this.wrapperScrollTop;
};

// coding
MScroll.prototype.reset = function () {
    if (this.enablePullupScroll) {
        this.isPullupScroll = false;

        // 小于可视区时需要不停加载列表数据
        if (!this.enableScroll()) {
            this.isPullupScroll = true;
            this.pullupScroll();
        }
    }
};

// 监听滚动
MScroll.prototype.listenerScroll = function () {
    // var _this = this;
    if (this.isGlobalScroll) {
        window.addEventListener('scroll', this.throttleScroll);
    } else {
        this.el.addEventListener('scroll', this.throttleScroll);
    }
};


// 移除监听滚动
MScroll.prototype.removeScroll = function () {
    // var _this = this;
    if (this.isGlobalScroll) {
        window.removeEventListener('scroll', this.throttleScroll);
    } else {
        this.el.removeEventListener('scroll', this.throttleScroll);
    }
};


function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function () {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}

```

上传图片

```html
<input accept="image/*" multiple @input="uploadImg($event, {name: 1})" type="file">

<script>
uploadImg(e, obj) {
  console.log(e.target.files);
  const _this = this;
  let fileMaxSize = 1024; // 1M
  let fileMinSize = 0;

    if (e.target.files.length <= 0) {
      return false;
    }

    //   let reader = new FileReader();
    let params = new FormData();
    let config = { headers: { "Content-Type": "multipart/form-data" } };

    for (let i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = function(e) {
        console.log(e);
        //   console.log(e.target.result);
      };
    }

    //   _this.fn.post("/", params, config).then(res => {
    // console.log(res);
    _this.$toast("错误");
    //   });
}

</script>
```

```js
const dynamicWrite = r => require.ensure([], () => r(require('../components/dynamic/write')), 'dynamicWrite');
```

```css
.clear-both:after {
    content: '';
    width: 100%;
    height: 0;
    display: block;
    overflow: hidden;
    clear: both;
}
```

设置title

```js
    setWechatTitle: function (title) {
        if (title === undefined || window.document.title === title) {
            return false;
        }
        document.title = title;
        var mobile = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(mobile)) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
            var iframeCallback = function () {
                setTimeout(function () {
                    iframe.removeEventListener('load', iframeCallback);
                    document.body.removeChild(iframe);
                }, 1);
            };
            iframe.addEventListener('load', iframeCallback);
            document.body.appendChild(iframe);
        }
    },

```

textarea 高度自适应

```js
        function flexText(el, minHeight) {
            var timer = null;
            // 由于ie8有溢出堆栈问题，故调整了这里
            var setStyle = function (el, minHeight) {
                if (minHeight) {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight > minHeight ? el.scrollHeight + 'px' : minHeight + 'px';
                } else {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                }
            };
            var delayedResize = function (el) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                timer = setTimeout(function () {
                    setStyle(el, minHeight);
                }, 20);
            };
            if (el.addEventListener) {
                el.addEventListener('input', function () {
                    setStyle(el, minHeight);
                }, false);
                setStyle(el, minHeight);
            } else if (el.attachEvent) {
                el.attachEvent('onpropertychange', function () {
                    setStyle(el, minHeight);
                });
                setStyle(el, minHeight);
            }
            if (window.VBArray && window.addEventListener) { // IE9
                el.attachEvent('onkeydown', function () {
                    var key = window.event.keyCode;
                    if (key === 8 || key === 46) delayedResize(el);
                });
                el.attachEvent('oncut', function () {
                    delayedResize(el);
                });
            }
        }
```

仿微信 画廊效果

```html
<template>
  <div class="dynamic-write">
    <div class="title">
      <input placeholder="输入标题" type="text" v-model="message.title">
    </div>
    <div class="content">
      <textarea ref="txt" placeholder="说点什么..." v-model="message.content"></textarea>
    </div>
    <div class="list-wrap clear-both">
      <div
        @click="showImg(index)"
        :key="index"
        v-for="(item, index) in message.imgList"
        class="img-wrap"
      >
        <img :src="item.src">
      </div>
      <div class="add">
        <input accept="image/*" multiple @input="uploadImg($event, {name: 1})" type="file">
      </div>
    </div>

    <div class="bottom-wrap clear-both">
      <div class="left">
        <a href="#">#添加话题#</a>
      </div>
      <div class="right">
        <span>{{message.content.length}}</span>
        <button class="button submit">发布</button>
      </div>
    </div>

    <!-- 仿微信 画廊效果 -->
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <!-- Background of PhotoSwipe. 
      It's a separate element as animating opacity is faster than rgba().-->
      <div class="pswp__bg"></div>

      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">
        <!-- Container that holds slides. 
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
        Don't modify these 3 pswp__item elements, data is added later on.-->
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <!--  Controls are self-explanatory. Order can be changed. -->

            <div class="pswp__counter"></div>

            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

            <button class="pswp__button pswp__button--share" title="Share"></button>

            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

            <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>

          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>

          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>

          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PhotoSwiper from "photoswipe";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";

export default {
  name: "dynamicWrite",
  data() {
    return {
      message: {
        title: "",
        content: "",
        imgList: [
          // { title: "zhangsan", src: "ccc", w: 1, h: 1 }
        ]
      },
      gallery: null
    };
  },
  created() {
    const _this = this;
  },
  mounted() {
    this.flexText(this.$refs.txt, 20);
  },
  methods: {
    uploadImg(e, obj) {
      const _this = this;
      let fileMaxSize = 1024 * 6; // 1M
      let fileMinSize = 0;
      let files = e.target.files;

      if (files.length <= 0) {
        return false;
      }

      //   let reader = new FileReader();
      let params = new FormData();
      let config = { headers: { "Content-Type": "multipart/form-data" } };

      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = function(ev) {
          console.log(_this.message.imgList);
          // let img = new Image();
          // img.src = reader.result;
          // img.onload = function() {
          let option = {
            title: files[i].name,
            src: reader.result,
            w: this.width,
            h: this.height
          };
          _this.message.imgList.push(option);

          // 仿微信 画廊效果
          _this.gallery.items.push(option);
          // };
        };
        reader.onerror = function(error) {
          console.log(error);
        };
      }

      //   _this.fn.http("/", params, config).then(res => {
      // console.log(res);
      // _this.$toast("错误");
      //   });
    },
    flexText(el, minHeight) {
      var timer = null;
      // 由于ie8有溢出堆栈问题，故调整了这里
      var setStyle = function(el, minHeight) {
        if (minHeight) {
          el.style.height = "auto";
          el.style.height =
            el.scrollHeight > minHeight
              ? el.scrollHeight + 20 + "px"
              : minHeight + 20 + "px";
        } else {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + 20 + "px";
        }
      };
      var delayedResize = function(el) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(function() {
          setStyle(el, minHeight);
        }, 200);
      };
      if (el.addEventListener) {
        el.addEventListener(
          "input",
          function() {
            setStyle(el, minHeight);
          },
          false
        );
        setStyle(el, minHeight);
      } else if (el.attachEvent) {
        el.attachEvent("onpropertychange", function() {
          setStyle(el, minHeight);
        });
        setStyle(el, minHeight);
      }
      if (window.VBArray && window.addEventListener) {
        // IE9
        el.attachEvent("onkeydown", function() {
          var key = window.event.keyCode;
          if (key === 8 || key === 46) delayedResize(el);
        });
        el.attachEvent("oncut", function() {
          delayedResize(el);
        });
      }
    },
    showImg(index) {
      // 仿微信 画廊效果
      let $pswp = document.getElementsByClassName("pswp")[0];
      let options = {
        showHideOpacity: true,
        mainClass: "pswp--minimal--dark",
        barsSize: { top: 0, bottom: 0 },
        captionEl: false,
        fullscreenEl: false,
        shareEl: false,
        bgOpacity: 0.85,
        tapToClose: true,
        tapToToggleControls: false
      };
      options.index = index;
      this.gallery = new PhotoSwiper(
        $pswp,
        PhotoSwipeUI_Default,
        this.message.imgList,
        options
      );
      this.gallery.init();

      // this.gallery.goTo(index);
    }
  }
};
</script>

```

clickoutside

```js
export default {
    bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener("click", documentHandler);
    },
    unbind (el, binding) {
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};
```

scroll 组件

```html
<template>
  <div class="i-scroll">
    <div :style="{'transform': 'translate(0, ' + translate + 'px)'}">
      <slot name="refresh">
        <div class="txt" v-if="refreshStatus === 'pull'">下拉刷新</div>
        <div class="txt" v-else-if="refreshStatus === 'drop'">释放刷新</div>
        <div class="txt" v-else-if="refreshStatus === 'loading'">正在刷新...</div>
      </slot>
      <slot></slot>
      <slot name="loadmore">
        <div class="txt" v-if="loadmoreLoading === 'loading'">加载更多...</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isGlobal: {
      default: true, // 是否全局监听,监听body滚动等
      type: Boolean
    },
    enableLoadmore: { // 是否开启底部加载
      default: true,
      type: Boolean
    },
    loadmore: { // 底部加载函数
      default: () => { },
      type: Function
    },
    loadmoreLoading: { // 底部加载状态 '': 初始化, 'loading': 正在加载
      default: '',
      type: String
    },
    loadmoreDistance: { // 距离底部距离,默认 10px
      default: 10,
      type: Number
    },

    enableRefresh: { // 是否开启下拉刷新
      default: false,
      type: Boolean
    },
    refresh: { // 下拉刷新函数
      default: () => { },
      type: Function
    },
    refreshLoading: { // 加载状态 '': 默认, 'loading': 正在刷新
      default: '',
      type: String
    },
    refreshDistance: { // 下拉距离,默认 10px
      default: 10,
      type: Number
    }
  },
  data () {
    return {
      isContainerFilled: false, // 是否填充满可视区域
      loadmoreEventElement: null, // 监听是否到达底部的元素
      listenerLoadmore: null, // loadmore 监听滚动

      refreshEventElement: null, // 监听下拉刷新的元素
      startY: 0, // 开始位置
      refreshMaxDistance: this.refreshDistance + 20, // 最大下拉距离
      translate: 0, // 下拉距离
      refreshStatus: '', // 下拉状态 '': 默认, 'start': 开始触发、点击, 'pull': 下拉, 'drop': 释放, 'loading': 正在刷新
      msg: 'msg'
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    enableLoadmore (val) {
      if (!val) {
        this.loadmoreEventElement && this.loadmoreEventElement.removeEventListener('scroll', this.listenerLoadmore)
      } else {
        this.init()
      }
    },
    loadmoreLoading (val) {
      if (this.enableLoadmore && this.loadmoreLoading !== 'loading') {
        if (this.fillContainer()) {
          this.listenerLoadmore = this.throttle(this.throttleScroll, 200)
          this.loadmoreEventElement.addEventListener('scroll', this.listenerLoadmore)
        } else {
          this.loadmore()
        }
      }
    },
    refreshLoading (val) {
      if (val !== 'loading') {
        this.refreshStatus = ''
        this.notifyRefreshStatus('')
        this.translate = 0
      }
    }
  },
  methods: {
    init () {
      if (this.enableLoadmore) {
        this.loadmoreEventElement = this.getEventElement()
        if (this.fillContainer()) {
          this.listenerLoadmore = this.throttle(this.throttleScroll, 200)
          this.loadmoreEventElement.addEventListener('scroll', this.listenerLoadmore)
        } else {
          this.loadmore()
        }
      }

      if (this.enableRefresh) {
        this.refreshEventElement = this.getEventElement()
        this.bindRefreshEvents()
      }
    },

    throttleScroll () {
      if (this.loadmoreLoading !== 'loading' && this.checkBottomReached()) {
        this.loadmore()
      }
    },

    // 是否滚动到底部
    checkBottomReached () {
      if (this.loadmoreEventElement === window) {
        return ((document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight + this.loadmoreDistance >= document.body.scrollHeight)
      } else {
        return (this.$el.scrollTop + this.$el.clientHeight + this.loadmoreDistance >= this.$el.scrollHeight)
      }
    },

    getEventElement () {
      if (this.isGlobal) {
        return window
      } else {
        return this.$el
      }
    },

    fillContainer () {
      if (this.loadmoreEventElement === window) {
        this.isContainerFilled = document.body.scrollHeight > document.documentElement.clientHeight
      } else {
        this.isContainerFilled = this.$el.scrollHeight > this.$el.clientHeight
      }

      return this.isContainerFilled
    },

    bindRefreshEvents () {
      this.$el.addEventListener('touchstart', this.startDrag)
      this.$el.addEventListener('touchmove', this.onDrag)
      this.$el.addEventListener('touchend', this.endDrag)
    },

    startDrag (event) {
      this.startY = event.touches[0].clientY
      if (this.refreshStatus !== 'loading') {
        this.refreshStatus = 'start'
        this.notifyRefreshStatus('start')
      }
    },

    onDrag (event) {
      event.stopPropagation()
      if (this.getScrollTop(this.refreshEventElement) <= 0 && this.refreshStatus !== 'loading' && this.refreshLoading !== 'loading') {
        let distance = (event.touches[0].clientY - this.startY) * 0.3
        if (distance > 0) {
          // 函数曲线图：http://fooplot.com/?lang=zh_hans#W3sidHlwZSI6MCwiZXEiOiIxMC0xLygwLjAwMSp4KzAuMSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMzEyLjAyMDUzMDIyNTMzNTczIiwiNDA5LjYyNDQzNTc4MTAxMTEzIiwiLTIyMy45ODI4NzE5NjQ2NDY1MyIsIjIyMC4xMDYzMzc4ODU0MTMwNyJdfV0-
          this.translate = this.refreshMaxDistance - 1 / (0.001 * distance + 1 / this.refreshMaxDistance)
        }
        if (this.translate >= this.refreshDistance) {
          this.refreshStatus = 'drop'
          this.notifyRefreshStatus('drop')
        } else {
          this.refreshStatus = 'pull'
          this.notifyRefreshStatus('pull')
        }
      }
    },

    endDrag (event) {
      if (this.refreshStatus === 'drop') {
        this.refreshStatus = 'loading'
        this.notifyRefreshStatus('loading')
        this.refresh()
      } else if (this.refreshStatus === 'loading') {

      } else {
        this.refreshStatus = ''
        this.notifyRefreshStatus('')
      }
    },

    getScrollTop (element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
      } else {
        return element.scrollTop
      }
    },

    notifyRefreshStatus (str) {
      this.$emit('refresh-status-change', str)
    },

    // 函数节流
    throttle (func, wait, options) {
      var timeout, context, args, result
      var previous = 0
      if (!options) options = {}

      var later = function () {
        previous = options.leading === false ? 0 : new Date().getTime()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }

      var throttled = function () {
        var now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          previous = now
          result = func.apply(context, args)
          if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining)
        }
        return result
      }

      throttled.cancel = function () {
        clearTimeout(timeout)
        previous = 0
        timeout = context = args = null
      }

      return throttled
    }

  },
  beforeDestroy () {
    this.loadmoreEventElement && this.loadmoreEventElement.removeEventListener('scroll', this.listenerLoadmore)
    this.$el.removeEventListener('touchstart', this.startDrag)
    this.$el.removeEventListener('touchmove', this.onDrag)
    this.$el.removeEventListener('touchend', this.endDrag)
  }
}
</script>

<style scoped>
.i-scroll .txt {
  font-size: 14px;
  color: #787878;
}
</style>
```

仿微博评论、话题

```html
<template>
  <div class="ry-topic-textarea">
    <textarea class="textarea" ref="txt" v-model="content"></textarea>
    <div :class="{'show': showBox}" class="box" ref="box">
      <div class="search-wrap">
        <input class="search" placeholder="#输入你想添加的话题" />
      </div>
      <div class="common-topic-wrap">
        <div class="title">常用话题</div>
        <div>
          <div @click="chooseTopic" class="list">#3</div>
          <div class="list">#3</div>
        </div>
      </div>
      <div class="hot-topic-wrap">
        <div class="title">热门话题</div>
        <div>
          <div class="list">#每日打卡#</div>
          <div class="list">#我要上首页#</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 微博话题替换:
// /\#([^\#|.]+)\#/g
// 微博@替换:
// /\@([^\@|.|^ ]+)/g

export default {
  data () {
    return {
      showBox: false,
      content: '',
      chooseTopicString: '',
      rangeData: {}
    }
  },
  mounted () {
    this.flexText(this.$refs.txt, 20);
  },
  watch: {
    content (newValue, oldValue) {
      // console.log(oldValue, newValue);

      // 通过比较，查看输入的是否是单个字符：‘#’
      if (this.compareString(oldValue, newValue)) {
        this.rangeData = this.getCursorPosition(this.$refs.txt);
        this.openBox();
      }
    }
  },
  methods: {
    openBox () {
      this.showBox = true;
    },
    compareString (firstString, secondString) {
      if (secondString.length - firstString.length === 1 && (firstString.replace(/\#/g, '') === secondString.replace(/\#/g, ''))) {
        return true;
      }
      return false;
    },
    chooseTopic () {
      this.showBox = false;
      this.chooseTopicString = '#测试哈#';
      let text = this.content;
      this.content = text.substring(0, this.rangeData.start - 1) + this.chooseTopicString + text.substring(this.rangeData.end + 1);
    },
    flexText (el, minHeight) {
      var timer = null;
      // 由于ie8有溢出堆栈问题，故调整了这里
      var setStyle = function (el, minHeight) {
        if (minHeight) {
          el.style.height = "auto";
          el.style.height =
            el.scrollHeight > minHeight
              ? el.scrollHeight + 20 + "px"
              : minHeight + 20 + "px";
        } else {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + 20 + "px";
        }
      };
      var delayedResize = function (el) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(function () {
          setStyle(el, minHeight);
        }, 200);
      };
      if (el.addEventListener) {
        el.addEventListener(
          "input",
          function () {
            setStyle(el, minHeight);
          },
          false
        );
        setStyle(el, minHeight);
      } else if (el.attachEvent) {
        el.attachEvent("onpropertychange", function () {
          setStyle(el, minHeight);
        });
        setStyle(el, minHeight);
      }
      if (window.VBArray && window.addEventListener) {
        // IE9
        el.attachEvent("onkeydown", function () {
          var key = window.event.keyCode;
          if (key === 8 || key === 46) delayedResize(el);
        });
        el.attachEvent("oncut", function () {
          delayedResize(el);
        });
      }
    },

    // 参考：司徒正美 [获取 Textarea 的光标位置](https://www.cnblogs.com/rubylouvre/articles/1885845.html)
    // 获取 Textarea 的光标位置
    getCursorPosition (textarea) {
      var rangeData = { text: "", start: 0, end: 0 };
      textarea.focus();
      if (textarea.setSelectionRange) { // w3c
        rangeData.start = textarea.selectionStart;
        rangeData.end = textarea.selectionEnd;
        rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
      } else if (document.selection) { // IE
        var i,
          oS = document.selection.createRange(),
          oR = document.body.createTextRange();
        oR.moveToElementText(textarea);
        rangeData.text = oS.text;
        rangeData.bookmark = oS.getBookmark();
        for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
          if (textarea.value.charAt(i) == '\n') {
            i++;
          }
        }
        rangeData.start = i;
        rangeData.end = rangeData.text.length + rangeData.start;
      }
      return rangeData;
    },
    setCursorPosition (textarea, rangeData) {
      if (!rangeData) {
        return;
      }
      if (textarea.setSelectionRange) { // w3c
        textarea.focus();
        textarea.setSelectionRange(rangeData.start, rangeData.end);
      } else if (textarea.createTextRange) { // IE
        var oR = textarea.createTextRange();
        if (textarea.value.length === rangeData.start) {
          oR.collapse(false);
          oR.select();
        } else {
          oR.moveToBookmark(rangeData.bookmark);
          oR.select();
        }
      }
    },

  },
}
</script>

<style scoped>
.ry-topic-textarea {
  position: relative;
}
.ry-topic-textarea .textarea {
  width: 100%;
  outline: none;
  padding: 4px 8px;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #cccccc;
}
.ry-topic-textarea .box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
  transition: all 0.4s ease-in-out;
}
.ry-topic-textarea .box.show {
  left: 0;
}
.ry-topic-textarea .box .search-wrap {
  margin: 20px 20px;
  padding: 0 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
}
.ry-topic-textarea .box .search-wrap .search {
  outline: none;
  border: none;
  font-size: 16px;
  padding: 4px 0;
}
.ry-topic-textarea .box .common-topic-wrap {
  margin: 20px 20px;
}
.ry-topic-textarea .box .hot-topic-wrap {
  margin: 20px 20px;
}
.ry-topic-textarea .box .common-topic-wrap .title,
.ry-topic-textarea .box .hot-topic-wrap .title {
  font-size: 16px;
  color: #888888;
}
.ry-topic-textarea .box .common-topic-wrap .list,
.ry-topic-textarea .box .hot-topic-wrap .list {
  font-size: 16px;
  color: #ff7b5c;
  display: block;
  margin: 20px 0;
}
</style>
```





