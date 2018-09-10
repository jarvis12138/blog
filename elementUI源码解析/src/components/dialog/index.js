import DialogComponent from './dialog.vue';

const Dialogs = {
    install: function(Vue){
        Vue.component('Dialogs', DialogComponent);
    }
};

export default Dialogs;