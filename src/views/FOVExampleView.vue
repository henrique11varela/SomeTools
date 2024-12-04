<script setup lang="ts">
import { onMounted, type ShallowRef, useTemplateRef } from "vue"
import { init, renderer, changeFOV } from '@/other/three/fov';

const canvasAreaElement: Readonly<ShallowRef<HTMLDivElement | null>> = useTemplateRef('canvas-area')


onMounted(() => {
  renderer.setSize(canvasAreaElement.value?.offsetWidth || 0, canvasAreaElement.value?.offsetHeight || 0);
  init(canvasAreaElement.value)
})

function onSliderChange(event: Event) {
  const target = (event.target as HTMLInputElement)
  changeFOV(Number(target.value))
}

</script>

<template>
  <main>
    <div>
      <input type="range" min="0" max="100" value="0" class="slider" id="myRange" @change="onSliderChange($event)">
    </div>
    <div ref="canvas-area" class="canvas-area">
    </div>
  </main>
</template>

<style lang="css" scoped>
/* main,
main * {
  border: 1px red solid;
} */

main {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.canvas-area {
  height: 90svh;
  overflow: auto;
}
</style>
