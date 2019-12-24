<template>
  <div id="content"></div>
</template>
<script>
import { actionMixin, canvasMixin } from './mixin'
export default {
  mixins: [actionMixin, canvasMixin],
  data () {
    return {
      gestureSets: []
    }
  },
  watch: {
    instructionSet (val) {
      let index = this.gestureSets.findIndex(g => g.gesture === val.join(''))
      if (index !== -1) {
        console.log(this.gestureSets[index].action.name)
      }
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
        this.gestureSets = JSON.parse(raw)
      })
    },
    // 指令事件绑定
    _performAction (e) {
      const gesture  = this.instructionSet.join("")
      let _action = false
      const actionItem = { ...this.gestureSets.find(g => g.gesture === gesture) }
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