<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['finished', 'brightest', 'extra-bright']);

const extraFlashAlpha = ref(0);
let hasEmittedExtraBright = false;
let hasClearedCanvasForHangar = false; // Флаг, чтобы очистить холст ровно ОДИН раз

// ==========================================
// 🚀 НАСТРОЙКИ ЭФФЕКТА (МЕНЯЙТЕ ИХ ЗДЕСЬ)
// ==========================================
const MIN_ALPHA = 0.95;      // Минимальная прозрачность звезд (0.90 означает, что все звезды почти на 100% плотные)
const MAX_ALPHA = 1.00;      // Максимальная прозрачность звезд (всегда 1.0)
const LINE_LENGTH_MULT = 20.0; // ДЛИНА ЛИНИЙ: увеличили с 4.5 до 12.0. Чем больше, тем бесконечнее линии.
const STAR_COUNT = 650;      // Плотность потока: добавили еще звезд для массивности эффекта
// ==========================================

const canvasRef = ref(null);
let ctx = null;
let animationFrameId = null;
let startTime = null;

const currentPhase = ref('idle'); 
const stars = [];
const internalSpeed = ref(1.5);

const shakeX = ref(0);
const shakeY = ref(0);
const flashAlpha = ref(0);
let hasEmittedBrightest = false;

function createStar() {
  return {
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    z: Math.random() * window.innerWidth,
    // Используем нашу константу минимальной прозрачности
    alpha: Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA 
  };
}

function initStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(createStar());
  }
}

function updatePhases(elapsed) {
  const _bugfix = elapsed; 

  const p1 = props.duration * 0.25; 
  const p2 = props.duration * 0.70; 
  const p3 = props.duration; // ПИК ПРЫЖКА

  const firstFlashFadeOut = 1000;  
  const planetApproach = 4500;     
  const secondFlashDuration = 3000; 

  const p4 = p3 + firstFlashFadeOut; 
  const p5 = p4 + planetApproach;    
  const p6 = p5 + secondFlashDuration; 

  // Фаза 1: Разгон космоса
  if (elapsed < p1) {
    currentPhase.value = 'acceleration';
    const progress = elapsed / p1;
    const intensity = progress * progress * 18; 
    shakeX.value = (Math.random() - 0.5) * intensity;
    shakeY.value = (Math.random() - 0.5) * intensity;
    flashAlpha.value = 0;
    extraFlashAlpha.value = 0;
  } 
  // Фаза 2: Полет в гиперпространстве
  else if (elapsed >= p1 && elapsed < p2) {
    currentPhase.value = 'coastal';
    shakeX.value = (Math.random() - 0.5) * 14;
    shakeY.value = (Math.random() - 0.5) * 14;
    flashAlpha.value = 0;
    extraFlashAlpha.value = 0;
  } 
  // Фаза 3: КУЛЬМИНАЦИЯ ПРЫЖКА (Экран плавно уходит в белизну)
  else if (elapsed >= p2 && elapsed < p3) {
    currentPhase.value = 'coastal'; 
    shakeX.value = (Math.random() - 0.5) * 16; 
    shakeY.value = (Math.random() - 0.5) * 16;

    const progress = (elapsed - p2) / (p3 - p2); 
    
    // Ограничиваем альфу максимум единицей
    flashAlpha.value = Math.min(1, progress); 
    extraFlashAlpha.value = 0;
  } 
  // Фаза 4: ВЫХОД ИЗ ПРЫЖКА (Первая вспышка тает, шлейфы растворяются)
  else if (elapsed >= p3 && elapsed < p4) {
    currentPhase.value = 'deceleration'; 
    
    // ГАРАНТИРОВАННЫЙ ТРИГГЕР: событие улетает строго на первом кадре этой фазы,
    // когда flashAlpha еще гарантированно равна 1, а время прыжка p3 только что вышло.
    if (!hasEmittedBrightest) {
      emit('brightest'); // В родителе: подкладываем планету и запускаем приближение
      hasEmittedBrightest = true;
    }

    const progress = (elapsed - p3) / firstFlashFadeOut;
    shakeX.value = (Math.random() - 0.5) * ((1 - progress) * 14);
    shakeY.value = (Math.random() - 0.5) * ((1 - progress) * 14);

    flashAlpha.value = Math.max(0, 1 - progress); 
    extraFlashAlpha.value = 0;
  }
  // Фаза 5: ПРИБЛИЖЕНИЕ К ПЛАНЕТЕ (Космос затих, работает зум в родителе)
  else if (elapsed >= p4 && elapsed < p5) {
    currentPhase.value = 'idle'; 
    shakeX.value = 0;
    shakeY.value = 0;
    flashAlpha.value = 0;
    extraFlashAlpha.value = 0;
  }
  // Фаза 6: ВТОРЕ ЗАБЕЛЕНИЕ ДЛЯ ПЕРЕХОДА В АНГАР
  else if (elapsed >= p5 && elapsed < p6) {
    currentPhase.value = 'idle';
    shakeX.value = 0;
    shakeY.value = 0;
    flashAlpha.value = 0;

    const progress = (elapsed - p5) / secondFlashDuration; 

    if (progress < 0.5) {
      // Плавно забеливаем экран до 1.0 (делим на 0.5, чтобы дойти до 1 за половину времени)
      extraFlashAlpha.value = Math.min(1, progress / 0.5);
    } else {
      // ГАРАНТИРОВАННЫЙ ТРИГГЕР: как только перевалили за экватор фазы (progress >= 0.5), 
      // extraFlashAlpha у нас гарантированно равна 1. Отправляем событие.
      if (!hasEmittedExtraBright) {
        emit('extra-bright'); // В родителе: меняем фон на ангар
        hasEmittedExtraBright = true;
      }
      // И плавно возвращаем прозрачность от 1 до 0
      extraFlashAlpha.value = Math.max(0, 1 - (progress - 0.5) / 0.5);
    }
  } 
  // Полный финал всей сцены прыжка
  else {
    currentPhase.value = 'idle';
    shakeX.value = 0;
    shakeY.value = 0;
    flashAlpha.value = 0;
    extraFlashAlpha.value = 0;

    hasEmittedBrightest = false;
    hasEmittedExtraBright = false;
    hasClearedCanvasForHangar = false;

    return true; 
  }
  return false;
}




function animate(timestamp) {
  if (!ctx || !canvasRef.value) return;
  if (!startTime) startTime = timestamp;

  const elapsed = timestamp - startTime;
  const isFinished = updatePhases(elapsed);

  if (isFinished) {
    cancelAnimationFrame(animationFrameId);
    emit('finished');
    return;
  }

  const canvas = canvasRef.value;
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;

  ctx.globalCompositeOperation = 'destination-out';
  
  // ПРИНУДИТЕЛЬНОЕ ОЧИЩЕНИЕ: если пик второго забеления настал, стираем холст до нуля
  if (hasEmittedExtraBright && !hasClearedCanvasForHangar) {
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Полная очистка без прозрачности
    hasClearedCanvasForHangar = true;     // Сработает ровно один раз за прыжок
  } 
  // Стандартная логика шлейфов (ваш оригинальный код)
  else if (currentPhase.value === 'acceleration' || currentPhase.value === 'coastal') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; 
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.40)'; 
  }
  
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  // Расчет скорости
  let targetSpeed = 1.5;
  if (currentPhase.value === 'acceleration' || currentPhase.value === 'coastal') {
    targetSpeed = 70; 
  } else if (currentPhase.value === 'deceleration') {
    targetSpeed = 0.2; 
  }
  internalSpeed.value += (targetSpeed - internalSpeed.value) * 0.035;

  // РИСУЕМ ЗВЕЗДЫ: Только если пик второго забеления еще НЕ пройден
  if (!hasEmittedExtraBright) {
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.z -= internalSpeed.value;

      // Сдвинули границу исчезновения до -500
      if (star.z <= -500) {
        Object.assign(star, createStar());
        star.z = width;
      }

      const k = 128.0 / (star.z <= 0 ? 1 : star.z);
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      const size = (1 - star.z / width) * 5.5; 
      
      // Расширили буфер до 600px за экран
      if (px >= -600 && px <= width + 600 && py >= -600 && py <= height + 600) {
        ctx.beginPath();

        if (internalSpeed.value > 12) {
          // Экстремальное удлинение хвостов
          const tailLength = internalSpeed.value * (2.0 + (1 - star.z / width) * LINE_LENGTH_MULT);
          const prevK = 128.0 / (star.z + tailLength);
          const prevX = star.x * prevK + cx;
          const prevY = star.y * prevK + cy;
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.lineWidth = Math.max(0.8, size);
          ctx.moveTo(px, py);
          ctx.lineTo(prevX, prevY);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.arc(px, py, size < 0.5 ? 0.5 : size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}


function resizeCanvas() {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  initStars();
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d', { alpha: true });
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animationFrameId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div 
    class="hyper-space-overlay"
    :style="{ transform: `translate(${shakeX}px, ${shakeY}px)` }"
  >
    <canvas ref="canvasRef"></canvas>
    
    <!-- Старая оригинальная вспышка -->
    <div 
      class="white-flash-layer" 
      :style="{ opacity: flashAlpha }"
    ></div>

    <!-- НОВОЕ второе плавное забеление -->
    <div 
      class="extra-white-layer" 
      :style="{ opacity: extraFlashAlpha }"
    ></div>
  </div>
</template>

<style scoped>
.hyper-space-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  /* Увеличили маргины до -80px, чтобы гигантские хвосты не обрезались по углам при тряске */
  margin: -80px;
  padding: 80px;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.white-flash-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  pointer-events: none;
  transition: opacity 0.05s ease-out; 
}
.extra-white-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  pointer-events: none;
}
</style>
