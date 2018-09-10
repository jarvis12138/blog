<template>
  <div id="app">
    <div style="text-align: center;">
      <img src="./assets/logo.png">
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

button{
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 6px 15px;
  border-radius: 4px;
  outline: none;
  border: 0;
  background-color: #2d8cf0;
  color: #fff;
  font-size: 20px;
}
</style>
