import Vue from "vue";
import content from './content.vue'

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(content);
  }
})