<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <Slider>
      <!-- <span slot="sliderButton">自己定制</span> -->
    </Slider>

    <div style="padding: 60px 0;">
      <button @click="dialog = true;">new dialog</button>
      <!-- .sync 修饰符 (vue) -->
      <Dialogs :visible.sync="dialog">

      </Dialogs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      dialog: false,
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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

.hello{
  margin: 0 20px 50px;
}
</style>
