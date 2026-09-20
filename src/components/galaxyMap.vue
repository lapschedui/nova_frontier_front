<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['name-sent']);

const sendData = (message) => {
    emit('name-sent', message);
};

const loadData = (message) => {
    localStorage.finish = message;
    localStorage.start = localStorage.now;
    delete localStorage.now;
    console.log('recording finish', localStorage.finish);
    console.log('delete now');
}
</script>

<template>
    <div class="space-container">Карта
        <div class="planet-container">
            <button class="planet-button astra-nexus" @click="loadData('AstraNexus'), sendData('ship')"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button nexoria" @click="loadData('Nexoria'), sendData('ship')"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button dataforge" @click="loadData('DataForge'), sendData('ship')"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button merida" @click="loadData('Merida'), sendData('ship')"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button helios-forge" @click="loadData('HeliosForge'), sendData('ship')">Девопс</button>
        </div>
        <div class="planet-container">
            <button class="planet-button chronos" @click="loadData('Chronos'), sendData('ship')">Тестирование</button>
        </div>
        <div class="planet-container">
            <button class="planet-button verida" @click="loadData('Verida'), sendData('ship')"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button lumina" @click="loadData('Lumina'), sendData('ship')">Дизайн</button>
        </div>
        <div class="planet-container">
            <button class="planet-button eridan" @click="loadData('Eridan'), sendData('ship')">Аналитика</button>
        </div>
        <div class="planet-container">
            <button class="planet-button arcadia-prime" @click="loadData('ArcadiaPrime'), sendData('ship')">Проектирование</button>
        </div>
        <div class="planet-container">
            <button class="planet-button cluster-of-asteroids-one"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button cluster-of-asteroids-two"></button>
        </div>
        <div class="planet-container">
            <button class="planet-button cluster-of-asteroids-three"></button>
        </div>
    </div>

</template>

<style scoped>
.planet-container {
    position: relative;
    display: contents;
}

.space-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-image: url('./images/galaxy_map.png');
    background-size: cover;
    background-position: center;
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(11, 1fr);
    /* gap: 10px; */
    margin: 0;
    padding: 0;
}

.planet-button {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgb(0, 0, 0, 0);
    border-color: rgba(252, 249, 249, 0);
    color: rgb(255, 254, 254);
}

.nebula {
    background-image: url('./images/planets/nebula.png');
}

.astra-nexus {
    background-image: url('./images/planets/AstraNexus.png');
    grid-column: 10 / span 5;
    grid-row: 6 / span 5;
}

.nexoria {
    background-image: url('./images/planets/Nexoria.png');
    grid-column: 9 / span 3;
    grid-row: 3 / span 3;
}

.merida {
    background-image: url('./images/planets/Merida.png');
    grid-column: 8 / span 1;
    grid-row: 5 / span 1;
}

.dataforge {
    background-image: url('./images/planets/DataForge.png');
    grid-column: 12;
    grid-row: 4;
}

.verida {
    background-image: url('./images/planets/Verida.png');
    grid-column: 4 / span 3;
    grid-row: 6 / span 3;
}

.helios-forge {
    background-image: url('./images/planets/HeliosForge.png');
    grid-column: 14 / span 2;
    grid-row: 2 / span 2;
}

.chronos {
    background-image: url('./images/planets/nebula.png');
    grid-column: 7 / span 3;
    grid-row: 1 / span 3;
}

.eridan {
    background-image: url('./images/planets/nebula.png');
    grid-column: 15 / span 2;
    grid-row: 5 / span 2;
}

.lumina {
    background-image: url('./images/planets/nebula.png');
    grid-column: 4 / span 2;
    grid-row: 3 / span 2;
}

.arcadia-prime {
    background-image: url('./images/planets/nebula.png');
    grid-column: 16 / span 5;
    grid-row: 6 / span 5;
}

.cluster-of-asteroids-one {
    background-image: url('./images/planets/cluster-of-asteroids-one.png');
    grid-column: 16 / span 4;
    grid-row: 1 / span 4;
}

.cluster-of-asteroids-two {
    background-image: url('./images/planets/cluster-of-asteroids-two.png');
    grid-column: 11 / span 4;
    grid-row: 4 / span 4;
}

.cluster-of-asteroids-three {
    background-image: url('./images/planets/cluster-of-asteroids-three.png');
    grid-column: 6 / span 4;
    grid-row: 7 / span 4;
}
</style>