<script setup>
import { onMounted, ref, watch } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
const player = ref(null);
const loop = ref(true);

function toggleLoop() {
  loop.value = !loop.value;
}

function play() {
  player.value?.getInstance().play();
}
function pause() {
  player.value?.getInstance().pause();
}
function stop() {
  player.value?.getInstance();
  player.value?.getInstance().stop();
}

onMounted(() => {
  if (player.value) {
    player.value.addEventListener('play', () => {
      console.log('play');
    });
    player.value.addEventListener('stop', () => {
      console.log('stop');
    });
    player.value.addEventListener('pause', () => {
      console.log('paused');
    });
    player.value.addEventListener('frame', ({ currentFrame }) => {
      // console.log('Frame:', currentFrame)
    });
    player.value.addEventListener('complete', () => {
      console.log('completed');
    });
  }
});
</script>

<template>
  <DotLottieVue
    backgroundColor="#222"
    style="height: 500px; width: 500px"
    autoplay
    :loop="loop"
    ref="player"
    src="https://lottie.host/5525262b-4e57-4f0a-8103-cfdaa7c8969e/VCYIkooYX8.json"
  />
  <div class="btn-group">
    <button @click="toggleLoop">Toggle Loop</button>
    <button @click="stop">Stop</button>
    <button @click="pause">Pause</button>
    <button @click="play">Play</button>
  </div>
</template>

<style scoped>
.btn-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
