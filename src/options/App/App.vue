<template>
  <div class="opt-box">
    <div style="width: 25%">
      <div class="opt-box__header">
        <img src="assets/icon/logo.png" style="width: 100px; height: 100px" alt="手势logo" />
        <span class="title">thumbs👍 选项</span>
      </div>
      <span>数据： {{msg}}</span>
      <el-input v-model="search" @input="saveStorage"/>
      <el-button>添加手势</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: '',
      search: ''
    }
  },
  mounted () {
    this.refreshData()
  },
  methods: {
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
  padding: 20px;
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
  color: #0f4c81;
  font-weight: 700;
}
</style>
