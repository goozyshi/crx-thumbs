import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Select, Card, Dialog, Option, OptionGroup, Message } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Card)
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
