import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Select, Input, Card } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Card)
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
