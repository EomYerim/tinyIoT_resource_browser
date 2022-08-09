<template>
<div>
  <b-navbar type="dark" variant="info">
    <b-navbar-brand href="#"></b-navbar-brand>

    <!-- <b-navbar-brand>Tiny IoT</b-navbar-brand> -->

    <b-navbar-brand><img :src="require('@/assets/TinyIoT.png')"/><span> Resource Browser </span></b-navbar-brand>

    <!-- <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-text>Resource Browser</b-nav-text>
      </b-navbar-nav>
    </b-collapse> -->
  </b-navbar>
</div>
</template>

<script>
export default {
    name: "header"
};
</script>

<style>
img {
  object-fit: cover;
  width: 25%;
  height: 25%;
}
span {
  opacity: 0.8;
}
</style>