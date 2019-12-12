<template>
  <div class="hello">
    {{time}}
    {{tab}}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      time: new Date(),
      tab: ''
    }
  },
  mounted () {
    setInterval (() => {
      this.time = new Date()
    }, 1000)
    chrome.tabs.query({
        active: true
    }, function(tabArray){
        console.log(tabArray);
    });
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