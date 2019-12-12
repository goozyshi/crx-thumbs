<template>
  <div class="main_app">
    <h1>Hello popasdasdup</h1>
    <MyClock></MyClock>
    <test></test>
  </div>
</template>

<script>
import MyClock from '../../components/myclock/myClock'
import test from './test/test'
export default {
  name: 'app',
  components: { MyClock, test }
}
</script>

<style>
.main_app {
  width: 500px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
