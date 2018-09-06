import SliderComponent from './slider.vue';

const Slider = {
    install: function(Vue){
        Vue.component('Slider', SliderComponent);
    }
};

export default Slider;