<template>
  <div class="opt-box">
      <span>数据： {{msg}}</span>
      <el-input v-model="search" @input="saveStorage"/>
    <div>
      <div class="opt-box__header">
        <img src="assets/icon/logo.png" style="width: 100px; height: 100px" alt="手势logo" />
        <span class="title">thumbs 手势</span>
      </div>
    </div>
    <div class="gesture-list">
      <el-card class="gesture-list__content">
        <div slot="header">添加手势</div>
        <div>
          <el-button @click="isShowCanvas = true">＋</el-button>
        </div>
      </el-card>
      <el-card class="gesture-list__content" v-for="g in gestureSets" :key="g.getsture">
        <div slot="header">
          <span>{{g.action.name}}</span>
          <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
        </div>
        <div>
          <div class="img-wraper" v-for="(direction, index) in g.gesture.split('')" :key="index">
            <img :src="actionIcon[direction]" style="width: 30px; height: 30px"/>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="添加手势"
      :visible.sync="isShowCanvas"
      width="30%"
    >
      <div>
        <div>
          <span style="line-height: 50px">手势:</span>
          <span v-if="!this.instructionSet.length" style="color: #999">按住鼠标右键拖动生成手势</span>
          <div class="img-wraper" v-for="(direction, index) in instructionSet" :key="index">
            <img :src="actionIcon[direction]" style="width: 30px; height: 30px"/>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <span style="margin-right: 10px">指令:</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddGesture('cancel')">取 消</el-button>
        <el-button type="primary" @click="onResetGesture">重 置</el-button>
        <el-button type="primary" @click="onAddGesture">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { gestureActionSets } from './mixins'
export default {
  name: 'app',
  mixins: [gestureActionSets],
  data () {
    return {
      msg: '',
      search: '',
      isShowCanvas: false,
      options: [{
        label: '热门城市',
        options: [{
          value: 'Shanghai',
          label: '上海'
        }, {
          value: 'Beijing',
          label: '北京'
        }]
      }, {
        label: '城市名',
        options: [{
          value: 'Chengdu',
          label: '成都'
        }, {
          value: 'Shenzhen',
          label: '深圳'
        }, {
          value: 'Guangzhou',
          label: '广州'
        }, {
          value: 'Dalian',
          label: '大连'
        }]
      }],
      value: '',
      gestureSets: [
        {
          gesture: 'U',
          action: {
            name: 'scrollToTop',
            act: 'scrollToTop'
          }
        },
        {
          gesture: 'DRULRDR',
          action: {
            name: 'scrollToBottom',
            act: 'scrollToBottom'
          }
        },
        {
          gesture: 'L',
          action: {
            name: 'Previous',
            act: 'Previous'
          }
        },
        {
          gesture: 'R',
          action: {
            name: 'Next',
            act: 'Next'
          }
        }
      ],
      tempCanvas: null,
      instructionSet: [],
      lineWidth: 5,
      fillStyle: 'red',
      isShowPath: true,
      TOLERANCE: 10, // 生成指令的阈值
      isMouseDown: false,
      ctx: null,
      lastX: null,
      lastY: null
    }
  },
  mounted () {
    this.refreshData()
  },
  watch: {
    isShowCanvas (val) {
      if (val) {
        this.bindMouseEvent()
      }
    }
  },
  methods: {
    onResetGesture () {
      this.instructionSet = []
      this.value = ''
    },
    onAddGesture (type = 'confirm') {
      if (type === 'cancel') {
        this.isShowCanvas = false
        this.onResetGesture()
        return
      }
      if (!this.instructionSet.length) {
        this.$message({type: 'warning', message: '按住右键生成手势'})
        return
      }
      if (this.instructionSet.length > 10) {
        this.$message({type: 'warning', message: '手势动作请保持在10个以内'})
        this.onResetGesture()
        return
      }      
      if (!this.value) {
        this.$message({type: 'warning', message: '请选择操作指令'})
      }
      const newGesture = {
        gesture: this.instructionSet.join(''),
        action: {
          name: this.value,
          act: this.value
        }
      }
      this.gestureSets.unshift(newGesture)
      this.$message({type: 'success', message: '操作成功'})
      this.isShowCanvas = false
    },
    bindMouseEvent () {
      document.body.addEventListener('mousedown', (e) => {
        this.handleMouseDown(e)
      }, false)
      document.body.addEventListener('mouseup', (e) => {
        this.handleMouseUp(e)
      }, false)
    },
    // 事件监听
    handleMouseDown (e) {
      let tempCanvas, ctx
      // 右键处理
      const isRightClick = (e.which === 3)
      if (isRightClick) {
        document.body.addEventListener('mousemove', (e) => {
          this.handleMouseMove(e)
        }, false)        
        if (this.tempCanvas) {
          try {
            document.body.removeChild(this.tempCanvas)
            tempCanvas = null
          } catch (e) {
            console.log(e)
          }
        }
        document.oncontextmenu = () => true
        const selectedText = window.getSelection().toString()
        if (selectedText) {
          return
        }
    
        // 初始化画布
        tempCanvas = this.tempCanvas = document.createElement('canvas')
        ctx = this.ctx = tempCanvas.getContext('2d')
        tempCanvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth)
        tempCanvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
        tempCanvas.style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; background-color: #409eff; opacity: 0.5'
        document.body.appendChild(tempCanvas)
    
        const canvasMouse = this._windowToCanvas(tempCanvas, e.clientX, e.clientY)
        this.lastX = canvasMouse.x
        this.lastY = canvasMouse.y
        this.isMouseDown = true
        
        this.isShowPath && ctx.moveTo(this.lastX, this.lastY)
      }
    },
    handleMouseMove (e) {
      if (this.isMouseDown) {
        let tempCanvas, ctx, direction, canvasMouse, curX, curY, dx, dy, lastDirection
        tempCanvas = this.tempCanvas
        ctx = this.ctx

        // 画线处理
        canvasMouse = this._windowToCanvas(tempCanvas, e.clientX, e.clientY)
        curX = canvasMouse.x
        curY = canvasMouse.y
        if (this.isShowPath) {
          ctx.lineTo(curX, curY)
          ctx.lineWidth = this.lineWidth
          ctx.strokeStyle = this.fillStyle
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
        // 方向记录
        dx = Math.abs(curX - this.lastX)
        dy = Math.abs(curY - this.lastY)
        if (dx < this.TOLERANCE && dy < this.TOLERANCE) {
          return
        } else {
          if (dx > dy) {
            direction = curX > this.lastX ? 'R' : 'L'
          } else {
            direction = curY > this.lastY ? 'D' : 'U'
          }
        }
        lastDirection = this.instructionSet[this.instructionSet.length -1]
        if (lastDirection !== direction) {
          this.instructionSet.push(direction)
        }
        this.lastX = curX
        this.lastY = curY
      }
    },
    handleMouseUp (e) {
      this.isMouseDown = false
      
      if (this.tempCanvas) {
        try {
          document.body.removeChild(this.tempCanvas)
          this.tempCanvas = null
          document.body.addEventListener("contextmenu",function(e){
            e.returnValue = false
          })
        } catch (e) {
          console.log(e)
        }
      }
    },
    _windowToCanvas (canvas, clientX, clientY) {
      const bbox = canvas.getBoundingClientRect()
      const position = {
        x: clientX - bbox.left * (canvas.width / bbox.width),
        y: clientY - bbox.top * (canvas.height / bbox.height)
      }
      return position
    },
    refreshData () {
      let _msg = chrome.storage.local.get(['key1'], (res) => {
        this.msg = res['key1']
      })
    },
    saveStorage () {
      chrome.storage.local.set({'key1': this.search}, () => {
        this.refreshData()
      })
    }
  }
}
</script>
<style scoped>
.opt-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f5f5f5;
}
.opt-box__header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
  padding: 10px;
}
.opt-box__header .title {
  margin-left: 2rem;
  font-size: 36px;
  color: #409eff;
  font-weight: 700;
}
.gesture-list {
  width: 100%;
  background-color: #fff;
}
.gesture-list__content {
  display: inline-block;
  border: 1px solid #ddd;
  min-width: 250px;
  max-width: 400px;
  height: 120px;
  margin: 20px;
  padding: 4px;
}
.gesture-list__content span {
  margin-right: 10px;
}
.img-wraper {
  display: inline-block;
  margin: 0 2px;
}
.my-canvas {
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  opacity: .5;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
