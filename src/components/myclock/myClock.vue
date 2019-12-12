<template>
  <div class="hello">
    {{time}}
  </div>
</template>

<script>
import formatTime from './formatTime'
export default {
  name: 'HelloWorld',
  data () {
    return {
      time: '',
      tab: ''
    }
  },
  mounted () {
    setInterval (() => {
      this.time = formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
    }, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>