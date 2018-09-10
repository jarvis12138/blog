<template>
    <div
    class="slider"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    >
        <div :style="{'width': oldValue + '%'}" class="slider-bar"></div>
        <div :style="{'left': oldValue + '%'}" class="slider-button-wrap">
            <slot name="sliderButton">
                <div class="slider-button"></div>
            </slot>
        </div>

    </div>
</template>

<script>
export default {
    name: 'slider',
    data() {
        return {
            dragging: false,
            startX: 0,
            currentX: 0,
            startY: 0,
            currentY: 0,
            oldValue: 0
        }
    },
    methods: {
        onButtonDown(event) {
            event.preventDefault();
            this.onDragStart(event);

            window.addEventListener('mousemove', this.onDragging);
            window.addEventListener('touchmove', this.onDragging);
            window.addEventListener('mouseup', this.onDragEnd);
            window.addEventListener('touchend', this.onDragEnd);
        },

        onDragStart(event) {
            this.dragging = true;

            // screenX 屏幕宽度
            // clientX 浏览器宽度，不包含滚动条滚动
            // pageX 浏览器宽度，包含滚动条滚动
            // 当type等于mousedown 有clientX、Y
            if(event.type === 'touchstart') {
                event.clientY = event.touches[0].clientY;
                event.clientX = event.touches[0].clientX;
            }

            if(this.vertical) {
                this.startY = event.clientY;
                this.getDistance(this.startY);
            } else {
                this.startX = event.clientX;
                this.getDistance(this.startX);
            }
        },

        onDragging(event) {
            if(this.dragging) {
                if(event.type === 'touchmove') {
                    event.clientY = event.touches[0].clientY;
                    event.clientX = event.touches[0].clientX;
                }

                if(this.vertical) {
                    this.currentY = event.clientY;
                    this.getDistance(this.currentY);
                } else {
                    this.currentX = event.clientX;
                    this.getDistance(this.currentX);
                }
            }
        },

        onDragEnd() {
            if(this.dragging) {
                // 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
                // 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
                setTimeout(() => {
                    this.dragging = false;
                }, 0);


                window.removeEventListener('mousemove', this.onDragging);
                window.removeEventListener('touchmove', this.onDragging);
                window.removeEventListener('mouseup', this.onDragEnd);
                window.removeEventListener('touchend', this.onDragEnd);
            }
        },

        getDistance(position) {
            if(this.vertical) {
                this.oldValue = ((position - parseFloat(this.$el.getBoundingClientRect().top)) / parseFloat(this.getStyle(this.$el, 'height')) * 100);
            } else {
                this.oldValue = ((position - parseFloat(this.$el.getBoundingClientRect().left)) / parseFloat(this.getStyle(this.$el, 'width')) * 100);
            }
        },

        getStyle(element, css) {
            let elementStyle = window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle;
            // 如：background-color
            let elementCss = elementStyle.getPropertyValue ? elementStyle.getPropertyValue(css) : elementStyle.getAttribute(css);
            return elementCss;
        }

    }
}
</script>

<style scoped>
.slider{
    width: 100%;
    height: 4px;
    /* margin: 16px 0; */
    background-color: #e9eaec;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
}
.slider-bar{
    height: 100%;
    background-color: #57a3f3;
    border-radius: 3px;
    position: absolute;
}
.slider-button-wrap{
    /* height: 20px; */
    /* width: 20px; */
    position: absolute;
    z-index: 1001;
    top: 50%;
    /* text-align: center; */
    /* background-color: #57a3f3; */
    -o-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
.slider-button{
    width: 16px;
    height: 16px;
    border: 2px solid #409eff;
    background-color: #ffffff;
    border-radius: 50%;
}
</style>