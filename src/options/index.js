import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Select, Card, Dialog, Option, OptionGroup, Message, MessageBox, Tooltip } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
