import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import './plugins/vee-validate'
import VueCompositionApi from "@vue/composition-api";
import "@/registerServiceWorker";
import router from "./router";
import App from "./App.vue";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
