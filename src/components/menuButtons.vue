<script setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['name-sent']);
const chapter = ref("ship");

const sendData = (message) => {
    emit('name-sent', message);
    chapter.value = message;
};

</script>

<template>
    <div class="menu-button row">
        <el-button v-show="chapter !== 'galaxy_map'" type="primary" class="medium-button"
            @click="sendData('mentor')">Наставник
        </el-button>
        <el-button v-show="chapter !== 'galaxy_map'" type="primary" class="medium-button"
            @click="sendData('fueling_station')">Миссии
        </el-button>
        <!-- <el-button type="primary" class="medium-button" @click="sendData('ship')">Центр снабжения
            </el-button> -->
        <!-- <el-button type="primary" class="medium-button" @click="sendData('ship')">Ремонтные доки
            </el-button> -->
        <el-button v-show="chapter !== 'galaxy_map'" type="primary" class="medium-button"
            @click="sendData('fueling_station')">Топливная станция
        </el-button>
        <!-- <el-button v-show="chapter == 'AstraNexus'" type="primary" class="medium-button"
                @click="sendData('tests')">Тесты
            </el-button> -->
        <el-button v-show="chapter === 'ship'" type="primary" class="medium-button"
            @click="sendData('galaxy_map')">Карта галактики
        </el-button>
        <el-button v-show="chapter === 'ship'" type="primary" class="medium-button"
            @click="sendData('galaxy_map')">Биржа заказов
        </el-button>
        <el-button v-show="chapter !== 'ship'" type="primary" class="medium-button" @click="sendData('ship')">Вернуться
            на корабль
        </el-button>
    </div>
</template>

<style scoped>

.menu-button {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 8vh;
    z-index: 3;
    align-items: center;
    backdrop-filter: blur(1px);
}
</style>