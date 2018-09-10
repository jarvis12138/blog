<template>
    <div v-show="visible">
    <!-- <div> -->
        <div @click="hide" ref="dialogMask" :style="{'z-index': zIndex}" class="dialog-mask"></div>
        <div :style="{'z-index': (zIndex+1)}" class="dialog-wrap">
            <!-- <slot name="dialogWrap"></slot> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dialogs',
    data() {
        return {

        }
    },
    props: {
        zIndex: {
            type: Number,
            default: 9999
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {

        // hide
        hide() {
            this.$emit('update:visible', false);
            // document.body.appendChild(this.$el);
            // this.$el.parentNode.removeChild(this.$el);
        },

    },
    watch: {
        visible(val) {
            let html = document.getElementsByTagName('html')[0];
            let body = document.getElementsByTagName('body')[0];
            if(val) {
                html.style.width = '100%';
                html.style.height = '100%';
                html.style.overflow = 'hidden';
                body.style.width = '100%';
                body.style.height = '100%';
                body.style.overflow = 'hidden';

                // 遮罩层添加阻挡touch事件 解决 ios 微信内页面滑动问题
                this.$refs.dialogMask.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                }, false);

                // document.body.appendChild(this.$el);
            } else {

                // this.$el.parentNode.removeChild(this.$el);
            }
        }
    }
}
</script>

<style scoped>
.dialog-mask{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
}
.dialog-wrap{
    width: 200px;
    height: 200px;
    position: fixed;
    left: 50%;
    top: 50%;

    -o-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>