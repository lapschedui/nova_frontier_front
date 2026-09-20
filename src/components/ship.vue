<script setup>
import { onMounted, ref } from 'vue';
import HyperDrive from './hyperDrive.vue';


const totalDuration = 6000; // Общее время прыжка
const isLoading = ref(false);
const isZooming = ref(false);
const disableTransition = ref(false);
let currentBg = ref(); // Фон

function finishJump() {
    isLoading.value = false;
    disableTransition.value = false; 
}

function moveToHangar() {
    currentBg.value = new URL('./images/hangar/' + localStorage.now + '.png', import.meta.url).href;
    disableTransition.value = true;
    isZooming.value = false;
}

function changeBackground() {
    currentBg.value = new URL('./images/hyperDrive/finish/' + localStorage.finish + '.png', import.meta.url).href;
    isZooming.value = true;
    console.log('change bg to ', localStorage.finish);
    localStorage.now = localStorage.finish;
    console.log('start is', localStorage.start);
    delete localStorage.finish;
    delete localStorage.start;
}

onMounted(() => {
    if (localStorage.start && localStorage.start !== 'undefined') {
        console.log('start is', localStorage.start);
        currentBg.value = new URL('./images/hyperDrive/start/' + localStorage.start + '.png', import.meta.url).href;
    } else if (localStorage.now && localStorage.now !== 'undefined') {
        currentBg.value = new URL('./images/hangar/' + localStorage.now + '.png', import.meta.url).href
    } else {
        currentBg.value = new URL('./images/hangar/AstraNexus.png', import.meta.url).href;
        localStorage.now = 'AstraNexus';
    }

    if (localStorage.finish && localStorage.finish !== 'undefined') {
        if (localStorage.finish == localStorage.start) {
            delete localStorage.finish
            console.log('finish = start, delete finish', localStorage.finish);
        } else {
            isLoading.value = true;
            console.log('true');
            return;
        }
    }

});

</script>

<template>
    <div>
        <div class="backgroung-container" :style="{ backgroundImage: `url(${currentBg})` }"
            :class="{ 'zoom-effect': isZooming, 'no-transition': disableTransition }">
        </div>
        <HyperDrive class="hyper-drive-container" v-if="isLoading" :key="isLoading" :duration="totalDuration"
            @brightest="changeBackground" @extra-bright="moveToHangar" @finished="finishJump" />
        <div class="ship-container">
            <!-- <el-button type="primary" class="small-button" @click="onJumpStart">HyperDrive</el-button> -->
            <!-- <el-progress :text-inside="true" :stroke-width="26" :percentage="70" /> -->
        </div>
    </div>
</template>

<style scoped>
.ship-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('./images/ships/AstraNexus.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
}

.hyper-drive-container {
    position: absolute;
    z-index: 1;
}

.backgroung-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    overflow: hidden;
    transition: transform 8s ease-out;
}

.backgroung-container.start-zoom {
    transform: scale(1.15);
    transition: transform 1.2s ease-in !important; /* ease-in даст эффект ускорения */
}

.backgroung-container.zoom-effect {
    transform: scale(1.12);
}

.backgroung-container.no-transition {
    transition: none !important;
    transform: scale(1) !important;
}
</style>