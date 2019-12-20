import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Select, Input } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
