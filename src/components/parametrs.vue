<script setup>
import { onMounted, ref } from 'vue';

let emblem = ref();
let now = ref();
let name = localStorage.name;

// const emit = defineEmits(['name-sent']);
// const menuButton = ref("start");

// const sendData = (message) => {
//     emit('name-sent', message);
// };

// onMounted(async () => {
//   menuButton.value = localStorage.now;
// });

onMounted(() => {
    if (localStorage.start && localStorage.start !== 'undefined') {
        emblem.value = new URL(window.location.origin + import.meta.env.BASE_URL + '/images/emblems/' + localStorage.start + '.png', import.meta.url).href;
        now.value = localStorage.start;
    } else if (localStorage.now && localStorage.now !== 'undefined') {
        emblem.value = new URL(window.location.origin + import.meta.env.BASE_URL + '/images/emblems/' + localStorage.now + '.png', import.meta.url).href
        now.value = localStorage.now;
    } else {
        emblem.value = new URL(window.location.origin + import.meta.env.BASE_URL + '/images/emblems/AstraNexus.png', import.meta.url).href;
        now.value = "AstraNexus";
    }
});

</script>

<template>
    <div class="parametrs-button row space glow">
        <div class="place column">
            <div class="backgroung" :style="{ backgroundImage: `url(${emblem})` }"></div>
            <div class="column">
                <el-button type="primary" class="mini-button text">{{ now }}</el-button>
                <el-button type="primary" class="mini-button">Planet place</el-button>
            </div>
        </div>
        <div class="parametrs row">
            <el-button type="primary" class="mini-button">fuel</el-button>
            <el-button type="primary" class="mini-button">credit</el-button>

        </div>
        <div class="person row">
            <div class="column">
                <el-button type="primary" class="mini-button">{{ name }}</el-button>
                <el-button type="primary" class="mini-button">Kadet</el-button>
                <el-button type="primary" class="mini-button">Progres</el-button>
            </div>
           <div class="backgroung" :style="{ backgroundImage: `url(${emblem})` }"></div>
        </div>
    </div>
</template>

<style scoped>
.parametrs-button {
    position: fixed;
    width: 100%;
    height: 15vh;
    z-index: 3;
}

.place {
    width: 30%;
    height: 100%;
    flex-direction: row;
    justify-content: flex-start;
    /* по центру */
    /* Альтернативы: space-between (по краям), flex-start (влево), flex-end (вправо) */
    /* Выравнивание по ВЕРТИКАЛИ */
    align-items: center;
    /* по центру */
    /* Альтернативы: flex-start (вверх), flex-end (вниз) */

}

.parametrs {
    width: 30%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.person {
    width: 30%;
    height: 100%;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.backgroung {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 140px;
    height: 15vh;
    margin-left: 2% 1% 1% 1%;
}

.space {
    background: radial-gradient(circle at 50% 0%, rgb(64, 158, 255, 0.4), rgb(29, 48, 67, 0.5));
    /* Глубокий космический фон с градиентом от темно-синего к почти черному */
    border: 1px solid rgb(64, 158, 255, 0.8);
    /* Тонкая неоновая фиолетовая рамка */
    border-radius: 12px;
    backdrop-filter: blur(1px);
    /* Эффект матового стекла (размывает то, что находится за панелью в космосе) */
    box-shadow:
        0 0 20px rgb(64, 158, 255, 0.2),
        inset 0 0 15px rgb(64, 158, 255, 0.2);
    /* Двойное свечение: мягкое фиолетовое наружу и легкое светлое внутрь */
}
</style>