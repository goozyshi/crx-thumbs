import Vue from "vue";
import content from './content.vue'

new Vue({
  el: "#content",
  render: createElement => {
    return createElement(content);
  }
})