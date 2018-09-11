<template>
    <div>
        <button @click="handle">button</button>
    </div>
</template>

<script>
export default {
    name: 'throttle',
    data() {
        return {
            handle: () => {}
        }
    },
    mounted() {
        // window.onscroll = this.throttle(this.log, 1000, 2000);

        // window.addEventListener('scroll', this.throttle(this.log, 1000, 2000));

        this.handle = this.throttle(this.log, 1000, 2000);
    },
    methods: {
        // 函数防抖
        debounce(fn, wait) {
            let timer = null;
            return () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn && fn();
                }, wait);
            };
        },

        // 函数节流
        throttle(fn, wait, time) {
            var previous = null;
            var timer = null;
            return () => {
                var now = +new Date();
                if(!previous) previous = now;
                if(now - previous > time) {
                    clearTimeout(timer);
                    fn && fn();
                    previous = now;
                } else {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        fn && fn();
                    }, wait);
                }
            };
        },

        log() {
            console.log(1);
        }

    }
}
</script>