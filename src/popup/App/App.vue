<template>
  <div>
    <div v-if="isLoading" class="text-box"><span class="title">正在加载……</span></div>
    <div v-else class="text-box">
      <div class="title">{{poem}}</div>
      <div>
        <span class="bage bage--plain">{{region}}</span>
        <span class="bage bage--plain" v-if="temperature">{{`${temperature}°C`}}</span>
        <span v-for="tag in this.tags" :key="tag" class="bage bage--primary">{{tag}}</span>
      </div>
      <div>
        <button class="btn" @click="getShiCi">换一句</button>
        <button class="btn" @click="sendInfo">发通知</button>
        <button class="btn" @click="goToOption">选 项</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'popup',
  data () {
    return {
      isLoading: true,
      isError: false,
      region: '',
      temperature: '',
      poem: '',
      tags: []
    }
  },
  mounted () {
    this.getIpInfo()
  },
  methods: {
    getIpInfo () {
      axios.get('https://v2.jinrishici.com/info').then(res => {
        res = res.data.data
        if (res) {
          this.region = res.region.replace(/\|/, ' | ') || ''
          this.temperature = res.weatherData.temperature || ''
          this.getShiCi()
        } else {
          this.isError = true
        }
      })
    },
    getShiCi () {
      axios.get('https://v2.jinrishici.com/one.json').then(res => {
        res = res.data.data
        this.poem = res.content.replace(/。/, '')
        this.tags = res.matchTags
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    goToOption () {
      chrome.tabs.create({url: 'chrome-extension://gjlaanimncgijljdjiplobfeojalaaak/options.html'});
    },
    sendInfo () {
      console.log(chrome)
      chrome.notifications.create(null, {
        type: 'image',
        iconUrl: 'up.png',
        title: '今日诗词',
        message: '',
        imageUrl: 'https://v2.jinrishici.com/one.svg'
      })
    }
  }
}
</script>
<style>
.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 400px;
  padding: 20px;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
.text-box .title {
  vertical-align: middle;
  line-height: normal;
  margin: 5px;
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
}
.bage {
  display: inline-block;
  
  margin: 10px 5px;
  padding: 5px 10px;

  font-size: 75%;
  line-height: 1;

  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;

  border-radius: 10rem;
}
.bage--plain {
  color: #666
}
.bage--primary {
  font-weight: 700;
  color: #409eff;
  background-color: #fff;
  border: 1px solid #409eff;
}
.btn {
  outline: none;
  border: #ddd 1px solid;
  padding: 5px 15px;
  margin: 0px 5px;
  border-radius: 10rem;
}
.btn:hover {
  border: #409eff 1px solid;
  background-color: #409eff;
  color: #fff;
  font-weight: 600;
}
</style>
