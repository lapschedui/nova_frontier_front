<script setup>
import { onMounted, ref } from 'vue';

let currentBg = ref(); // Фон

onMounted(() => {
    currentBg.value = new URL(window.location.origin + import.meta.env.BASE_URL + '/images/sections/mentorsOffice/' + localStorage.now + '.png', import.meta.url).href;
}
)
</script>

<template>
    <div class="backgroung-container" :style="{ backgroundImage: `url(${currentBg})` }">Mentor</div>
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
}

</style>