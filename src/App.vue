<template>
  <div id="app">
    <Header />
    <div id="content" class="content">
      <Home />
    </div>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue';
import Home from './views/Home.vue';

export default {
  name: 'App',
  components: {
    Header,
    Home
  }
};
</script>

<style>
</style>