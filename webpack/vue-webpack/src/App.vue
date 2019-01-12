<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h6>test</h6>
    <input type="text" v-model="msg" />
    <div>{{msg}}</div>
    <div class="box">box</div>
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      msg: 'hello'
    }
  },
  created() {
    console.log('vue created');
  }
}
</script>

<style>
.box {
  color: red;
}
</style>

