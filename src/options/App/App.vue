<template>
  <div class="opt-box">
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
          <el-button @click="bindMouseEvent">＋</el-button>
        </div>
      </el-card>
      <el-card class="gesture-list__content" v-for="(g, index) in gestureSets" :key="index">
        <div slot="header">
          <span>{{g.action.name}}</span>
          <el-button style="float: right; padding: 3px 0; margin-left: 20px" type="text" @click="isEdit = true">编辑</el-button>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onDelete(index)">删除</el-button>
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
          <span style="line-height: 50px; margin-right: 20px">手势:</span>
          <span v-if="!this.instructionSet.length" style="color: #999">按住鼠标右键拖动生成手势</span>
          <div class="img-wraper" v-for="(direction, index) in instructionSet" :key="index">
            <img :src="actionIcon[direction]" style="width: 30px; height: 30px"/>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <span style="line-height: 50px; margin-right: 20px">指令:</span>
          <el-select v-model="actLabel" placeholder="请选择" @change="chooseInstruction">
            <el-option-group
              v-for="group in gestureOptions"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddGesture('cancel')">取 消</el-button>
        <el-button @click="onResetGesture">重 置</el-button>
        <el-button type="primary" @click="onAddGesture">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { canvasMixin, gestureMixin } from '../../content/mixin'
export default {
  name: 'app',
  mixins: [canvasMixin, gestureMixin],
  data () {
    return {
      isShowCanvas: false,
      isEdit: false,
      gestureSets: [
        {
          gesture: 'U',
          action: {
            name: '顶部',
            act: 'G_totop'
          }
        },
        {
          gesture: 'D',
          action: {
            name: '底部',
            act: 'G_tobottom'
          }
        },
        {
          gesture: 'L',
          action: {
            name: '后退',
            act: 'G_back'
          }
        },
        {
          gesture: 'R',
          action: {
            name: '前进',
            act: 'G_forward'
          }
        }
      ],  
      actLabel: '',
      actValue: ''
    }
  },
  mounted () {
    this.getStorage()
  },
  methods: {
    onDelete (index) {
      console.log(index)
      this.gestureSets.splice(index, 1)
      this.saveStorage()
      this.$message({type: 'success', message: '操作成功'})
    },
    chooseInstruction (item) {
      this.actLabel = item.label
      this.actValue = item.value
    },
    onResetGesture () {
      this.instructionSet = []
      this.actLabel = ''
      this.actValue = ''
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
      if (!this.actLabel) {
        this.$message({type: 'warning', message: '请选择操作指令'})
      }
      const newGesture = {
        gesture: this.instructionSet.join(''),
        action: {
          name: this.actLabel,
          act: this.actValue
        }
      }
      this.gestureSets.unshift(newGesture)
      this.onResetGesture()
      this.saveStorage()
      this.isShowCanvas = false
      this.$message({type: 'success', message: '配置成功，刷新页面后使用'})
    },
    bindMouseEvent () {
      this.isShowCanvas = true
      document.body.addEventListener('mousedown', (e) => {
        this.handleMouseDown(e)
      }, false)
      document.body.addEventListener('mouseup', (e) => {
        this.handleMouseUp(e, true)
      }, false)
      document.body.addEventListener('mousemove', (e) => {
        this.handleMouseMove(e)
      }, false)
    },
    getStorage () {
      chrome.storage.local.get(['userGestureList'], (res) => {
        const raw = res.userGestureList || '[]'
        this.gestureSets = JSON.parse(raw)
        console.log(this.gestureSets)
      })
    },
    saveStorage () {
      const userGestureList = this.gestureSets.length === 0 ? [] : this.gestureSets
      chrome.storage.local.set({'userGestureList': JSON.stringify(userGestureList)}, () => {
        this.getStorage ()
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
