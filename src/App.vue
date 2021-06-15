<template>
  <div id="app">
    <keep-alive>
     <router-view/>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
  components:{

  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');

body{
  margin: 0;
}

#app{
  margin: 0;
}
  
</style>
