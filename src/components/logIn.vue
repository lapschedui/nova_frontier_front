<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';
import { login, createUser } from '@/api/auth';

const spaceCanvas = ref(null);
let ctx = null;
let animationFrameId = null;
let stars = [];

const chapter = ref("start");
const loginName = ref('')
const loginNumber = ref('')
const regName = ref('')

const change = (name) => {
  chapter.value = name;
}

const emit = defineEmits(['name-sent']);

const sendData = (message) => {
  emit('name-sent', message);
};

async function registration() {
  try {
    let response = await createUser({ "username": regName.value });
    
    console.log("Номер вашего кадета:", response.user_number); 
    localStorage.id = response.user_number;
    alert(`Регистрация успешна! Ваш номер доступа: ${response.user_number}. Запомните его!`);
    
    sendData('ship');
  } catch (error) {
    console.error(error);
    alert("Ошибка регистрации: возможно, это имя уже занято.");
  }
}

async function logIn() {
  try {
    let response = await login({ 
      "username": loginName.value, 
      "user_number": Number(loginNumber.value)
    });
    
    localStorage.name = response.user.username;
    localStorage.id = response.user.id;
    localStorage.now = response.user.now;
    console.log("Вход успешен для:", response.user.username,response.user.now );
    
    sendData('ship');
  } catch (error) {
    console.error(error);
    alert("Ошибка входа: проверьте правильность имени и номера доступа.");
  }
}

const STAR_COUNT = 1500;
const random = (min, max) => Math.random() * (max - min) + min;

// Генерация звезд
const initStars = (width, height) => {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height),
      radius: random(0.5, 2.3),
      alpha: random(0.1, 1),
      speed: random(0.006, 0.013),
      growing: Math.random() > 0.8
    });
  }
};

// Анимационный цикл
const animate = () => {
  const width = spaceCanvas.value.width;
  const height = spaceCanvas.value.height;

  // ОЧИСТКА КАДРА: делает холст прозрачным перед новой отрисовкой звезд
  ctx.clearRect(0, 0, width, height);

  // Рисуем мерцающие звезды
  stars.forEach((star) => {
    // Изменяем яркость
    if (star.growing) {
      star.alpha += star.speed;
      if (star.alpha >= 1) star.growing = false;
    } else {
      star.alpha -= star.speed;
      if (star.alpha <= 0.1) star.growing = true;
    }

    // Отрисовка
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;

    if (star.radius > 1.5) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fill();
  });

  ctx.shadowBlur = 0;
  animationFrameId = requestAnimationFrame(animate);
};

const resizeCanvas = () => {
  if (!spaceCanvas.value) return;
  spaceCanvas.value.width = window.innerWidth;
  spaceCanvas.value.height = window.innerHeight;
  initStars(spaceCanvas.value.width, spaceCanvas.value.height);
};



onMounted(async () => {
  ctx = spaceCanvas.value.getContext('2d');
  resizeCanvas();
  animate();
  window.addEventListener('resize', resizeCanvas);

});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <div class="space-container">
    <canvas ref="spaceCanvas" class="space-canvas"></canvas>

    <div class="content">
      <div class="column" v-if="chapter === 'start'">
        <el-button type="primary" class="large-button" @click="change('register')">Начать</el-button>
        <el-button type="primary" class="large-button" style="margin-left: 0;"
          @click="change('log_in')">Продолжить</el-button>
      </div>
      <div class="column" v-if="chapter === 'log_in'">
        <el-input v-model="loginName" type="primary" placeholder="Имя"></el-input>
        <el-input v-model="loginNumber" type="primary" placeholder="Номер"></el-input>
        <el-button type="primary" class="medium-button" @click="logIn">Войти</el-button>
      </div>
      <div class="column" v-if="chapter === 'register'">
        <el-input v-model="regName" type="primary" placeholder="Имя"></el-input>
        <el-button type="primary" class="medium-button" @click="registration">Зарегистрироваться</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('./images/galaxy_map.png');
  background-size: cover;
  background-position: center;
}

.space-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  /* Чтобы холст не перехватывал клики мыши */
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}
</style>
