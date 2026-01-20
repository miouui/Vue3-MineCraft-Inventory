<template>
  <div class="app-wrapper">
    <MinecraftInv />
    <!-- <MinecraftInventory /> -->
  </div>
</template>

<script setup>
import MinecraftInv from './components/MinecraftInv.vue';
// import MinecraftInventory from './components/MinecraftInventory.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #333; 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.app-wrapper {
 
}
</style>