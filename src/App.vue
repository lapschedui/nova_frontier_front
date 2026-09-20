<script setup>
import GalaxyMap from './components/galaxyMap.vue';
import LogIn from './components/logIn.vue';
import MenuButtons from './components/menuButtons.vue';
import Ship from './components/ship.vue';
import { ref } from 'vue'
import Dialog from './components/dialog.vue';
import Tests from './components/tests.vue';
import Mentor from './components/mentor.vue';
import FuelingStation from './components/fuelingStation.vue';
import Parametrs from './components/parametrs.vue';

const chapter = ref("log-in");


const change = (name) => {
    chapter.value = name;
}


function checkAccess() {
    const savedId = localStorage.getItem('id');
    console.log('savedId = ', savedId);
    if (savedId) {
        change('ship');
    } else {
        change('log_in');
    }
}

checkAccess();


</script>

<template>
    <div>
        <LogIn v-if="chapter === 'log_in'" @name-sent="change($event)" />
        <Ship v-else-if="chapter === 'ship'" @name-sent="change($event)" />
        <Dialog v-else-if="chapter === 'dialog'"  @name-sent="change($event)" />
        <Tests v-else-if="chapter === 'tests'"  @name-sent="change($event)" />
        <Mentor v-else-if="chapter === 'mentor'"  @name-sent="change($event)" />
        <FuelingStation v-else-if="chapter === 'fueling_station'" @name-sent="change($event)" />
        <Parametrs v-show="chapter === 'ship' || chapter === 'fueling_station'" :key="chapter"/>
        <MenuButtons v-show="chapter !== 'log_in' && chapter !== 'dialog' && chapter !== 'tests'" @name-sent="change($event)" />
        <GalaxyMap v-show="chapter === 'galaxy_map'" @name-sent="change($event)" />
    </div>
</template>

<style scoped>
</style>
