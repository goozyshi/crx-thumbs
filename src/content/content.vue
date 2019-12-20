<template>
  <div id="content"></div>
</template>
<script>
import BrowserGesture from './gesture'
import $ from 'jquery'
import { actionMixin } from './mixin'
export default {
  mixins: [actionMixin],
  methods: {
    set_gesture () {
      var bg = new BrowserGesture()
      bg._ACTION = this.action
    }
  },
  mounted () {
    this.set_gesture()
  }
}
</script>