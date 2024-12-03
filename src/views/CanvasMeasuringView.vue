<script setup lang="ts">
import { ref, type Ref, type ShallowRef, useTemplateRef } from "vue"
const image = ref<HTMLImageElement>(new Image())
const canvasElement: Readonly<ShallowRef<HTMLCanvasElement | null>> = useTemplateRef('canvasElement')

const referenceRuler: Ref<(number | null)[][]> = ref([[null, null], [null, null]])
const measuringRuler: Ref<(number | null)[][]> = ref([[null, null], [null, null]])
const referenceLength: Ref<number> = ref(0)
const measuringLength: Ref<number> = ref(0)

function onInputChange(event: Event) {
  const inputEl: HTMLInputElement = event.target as HTMLInputElement
  if (inputEl.files?.length) {
    const file: File = inputEl.files[0]
    const ctx = canvasElement.value?.getContext('2d')
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
      if (evt.target?.readyState == FileReader.DONE) {
        image.value.src = evt?.target.result as string
        setTimeout(() => {
          canvasElement.value!.height = image.value.naturalHeight
          canvasElement.value!.width = image.value.naturalWidth
          setTimeout(() => {
            ctx?.drawImage(image.value, 0, 0);
          }, 0)
        }, 0)
      }
    }
  }
}

function drawImages() {
  const ctx = canvasElement.value?.getContext('2d')
  ctx?.drawImage(image.value, 0, 0);
  if (referenceRuler.value[1][1]) {
    ctx?.beginPath();
    ctx!.strokeStyle = "green"
    ctx!.lineWidth = 5;
    ctx?.moveTo(referenceRuler.value[0][0] || 0, referenceRuler.value[0][1] || 0);
    ctx?.lineTo(referenceRuler.value[1][0] || 0, referenceRuler.value[1][1] || 0);
    ctx?.closePath();
    ctx?.stroke();
  }
  if (measuringRuler.value[1][1]) {
    ctx?.beginPath();
    ctx!.strokeStyle = "red"
    ctx!.lineWidth = 5;
    ctx?.moveTo(measuringRuler.value[0][0] || 0, measuringRuler.value[0][1] || 0);
    ctx?.lineTo(measuringRuler.value[1][0] || 0, measuringRuler.value[1][1] || 0);
    ctx?.closePath();
    ctx?.stroke();
  }
}

function calculateLength() {
  function calculateDistance(vec) {
    const newVec = [vec[1][0] - vec[0][0], vec[1][1] - vec[0][1]]
    return Math.sqrt(newVec[0] * newVec[0] + newVec[1] * newVec[1]);
  }
  const refPXlength = calculateDistance(referenceRuler.value)
  const meaPXlength = calculateDistance(measuringRuler.value)
  const meaValue = referenceLength.value / refPXlength * meaPXlength
  measuringLength.value = meaValue
}

function drawReferenceRuler(event: Event) {
  function start(event2: Event) {
    const evt = (event2 as PointerEvent)
    referenceRuler.value[0] = [evt.offsetX, evt.offsetY]
    canvasElement.value?.removeEventListener('click', start)
    canvasElement.value?.addEventListener('click', end)
  }
  function end(event2: Event) {
    const evt = (event2 as PointerEvent)
    referenceRuler.value[1] = [evt.offsetX, evt.offsetY]
    drawImages()
    canvasElement.value?.removeEventListener('click', end)
  }
  canvasElement.value?.addEventListener('click', start)
}

function drawMeasuringRuler(event: Event) {
  function start(event2: Event) {
    const evt = (event2 as PointerEvent)
    measuringRuler.value[0] = [evt.offsetX, evt.offsetY]
    canvasElement.value?.removeEventListener('click', start)
    canvasElement.value?.addEventListener('click', end)
  }
  function end(event2: Event) {
    const evt = (event2 as PointerEvent)
    measuringRuler.value[1] = [evt.offsetX, evt.offsetY]
    drawImages()
    calculateLength()
    canvasElement.value?.removeEventListener('click', end)
  }
  canvasElement.value?.addEventListener('click', start)
}


</script>

<template>
  <main>
    <div>
      <input type="file" accept="image/*" @change="onInputChange($event)" />
      <div>
        <button @click="drawReferenceRuler($event)">Reference ruler</button>
        <input type="number" v-model="referenceLength" @keyup="calculateLength">
      </div>
      <div>
        <button @click="drawMeasuringRuler($event)">Measuring ruler</button>
        <input type="number" v-model="measuringLength" readonly>
      </div>
    </div>
    <div class="canvas-area">
      <canvas ref="canvasElement"></canvas>
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
  max-height: 95svh;
  overflow: auto;
}
</style>
