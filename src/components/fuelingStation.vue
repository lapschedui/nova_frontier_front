<script setup>
import { onMounted, ref } from 'vue';

let currentBg = ref(); // Фон

onMounted(() => {
    currentBg.value = new URL('./images/sections/fuelingStation/' + localStorage.now + '.png', import.meta.url).href;
}
)
</script>

<template>
    <div class="backgroung-container" :style="{ backgroundImage: `url(${currentBg})` }"></div>
</template>

<style scoped>

.backgroung-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    overflow: hidden;
    transition: transform 3.5s ease-out;
}

</style>