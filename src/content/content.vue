<template>
  <div id="content"></div>
</template>
<script>
import $ from 'jquery'
import { actionMixin, canvasMixin } from './mixin'
import { access } from 'fs'
export default {
  mixins: [actionMixin, canvasMixin],
  data () {
    return {
      userGestureList: [],
    }
  },
  mounted () {
    this.getStorage()
    document.body.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e)
    }, false)
    document.body.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e)
    }, false)
    document.body.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e)
    }, false)
  },
  methods: {
    getStorage () {
      chrome.storage.local.get(['userGestureList'], (res) => {
        const raw = res.userGestureList || '[]'
        this.userGestureList = JSON.parse(raw)
      })
    },
    // 指令事件绑定
    _performAction (e) {
      const gesture  = this.instructionSet.join("")
      let _action = false
      const actionItem = { ...this.userGestureList.find(g => g.gesture === gesture) }
      if (JSON.stringify(actionItem) !== '{}') {
        _action = true
        const act = actionItem.action.act
        this[act]()
      } else {
        _action = false
        console.log(`未定义的指令执行操作:${this.instructionSet}`)
      }
      this.instructionSet = []
      if(_action){
        document.body.addEventListener('contextmenu',function(e){
          e.returnValue = false
        })
      }
    } 
  }
}
</script>