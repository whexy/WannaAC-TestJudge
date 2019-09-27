import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'
import VueAxios from "vue-axios";
import VueCodemirror from "vue-codemirror";
import 'codemirror/lib/codemirror.css';
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard);
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(VueCodemirror);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
