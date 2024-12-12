<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { type DotLottieVueInstance, DotLottieVue, setWasmUrl } from '@lottiefiles/dotlottie-vue';
import wasmUrl from '../../../packages/web/src/core/dotlottie-player.wasm?url';

setWasmUrl(wasmUrl);

function dotLottieRefCallback(dotLottie: DotLottieVueInstance) {
  console.log('dotLottieRefCallback', dotLottie);
}

const player: Ref<DotLottieVueInstance | null> = ref(null);

function toggleLoop() {
  const dotLottie = player.value?.getDotLottieInstance();
  dotLottie?.setLoop(!dotLottie?.loop);
}

function play() {
  player.value?.getDotLottieInstance()?.play();
}
function pause() {
  player.value?.getDotLottieInstance()?.pause();
}
function stop() {
  player.value?.getDotLottieInstance()?.stop();
}

onMounted(() => {
  if (player.value) {
    const dotLottie = player.value?.getDotLottieInstance();
    dotLottie?.addEventListener('play', () => {
      console.log('play');
    });
    dotLottie?.addEventListener('stop', () => {
      console.log('stop');
    });
    dotLottie?.addEventListener('pause', () => {
      console.log('paused');
    });
    // dotLottie.addEventListener('frame', ({currentFrame}) => {
    //   console.log('Frame:', currentFrame)
    // });
    dotLottie?.addEventListener('complete', () => {
      console.log('completed');
    });
  }
});
</script>

<template>
  <DotLottieVue
    background-color="#222"
    style="height: 500px; width: 500px"
    autoplay
    loop
    ref="player"
    src="https://lottie.host/5525262b-4e57-4f0a-8103-cfdaa7c8969e/VCYIkooYX8.json"
    :dot-lottie-ref-callback="dotLottieRefCallback"
    play-on-hover
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
