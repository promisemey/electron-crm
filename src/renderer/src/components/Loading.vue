<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { LottieAnimation } from 'lottie-web-vue'
import WaterLoader from '@assets/lotties/WaterLoader.json'
import { useMainStore } from '@store'
import { storeToRefs } from 'pinia'
// import Cycling from '@assets/lotties/girl-cycling-in-autumn.json'
// import WatermelonJSON from '@assets/lotties/working-chart.json'
// import OpenerLoading from '@assets/lotties/OpenerLoading.json'
// import Olympic from '@assets/lotties/olympic-athlete.json'
// import HandLoading from '@assets/lotties/hand-loading.json'
const mainStore = useMainStore()
const { loading } = storeToRefs(mainStore)
// loading 实例
const anim = ref()
// watch(loading, () => {
//   if (!loading.value) {
//   }
// })

// // called after each loop
// const loopComplete = () => {
//   console.log('Loop complete')
// }

// // called after first loop
// const complete = () => {
//   console.log('First loop complete')
// }

// // called after first frame entered
// const enterFrame = () => {
//   console.log('Entered first frame')
// }

// // called after segment started
// const segmentStart = () => {
//   console.log('Segment started')
// }

// // called after animation stopped
// const stopped = () => {
//   console.log('Stopped')
// }

onMounted(() => {})
</script>
<template>
  <!-- <div class="loading w-full flex-1 overflow-hidden">
    <div class="w-full h-full flex overflow-hidden relative"> -->
  <div
    v-if="loading"
    class="loading-bg transition-all bg-white/70 absolute z-20 w-full h-full flex justify-center items-center"
  >
    <LottieAnimation
      ref="anim"
      class="w-80 h-64"
      :animation-data="WaterLoader"
      :loop="true"
      :auto-play="true"
      :speed="2"
    />
  </div>
  <!-- <slot></slot> -->
  <!-- </div> -->

  <!-- <LottieAnimation
      ref="anim"
      class="w-80 h-64"
      :animation-data="WatermelonJSON"
      :loop="true"
      :auto-play="true"
      :speed="1"
      @loop-complete="loopComplete"
      @complete="complete"
      @enter-frame="enterFrame"
      @segment-start="segmentStart"
      @stopped="stopped"
    /> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
