<script setup lang="ts">
import { ref, type Ref, useTemplateRef } from "vue"
const vidsrc = ref<string | undefined>(undefined)
const vidElement: Ref<HTMLVideoElement> = useTemplateRef('vidElement')

function onInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files[0]
  const URL = window.URL || window.webkitURL
  const urlObject = URL.createObjectURL(file)
  vidsrc.value = urlObject
}

function onPlayPause(event: Event) {
  if (vidElement.value.paused) {
    vidElement.value.play()
  }
  else {
    vidElement.value.pause()
  }
}

function onPlaybackSpeedChange(event: Event) {
  vidElement.value.playbackRate = +(event.target as HTMLInputElement)?.value;
  console.dir(vidElement.value);
}

function onNudge(event: Event, direction: ('left' | 'right') = 'right', magnitude: number = 1) {
  let d = 1
  if (direction == 'left') {
    d = -1
  }
  const time = vidElement.value.currentTime + (d * magnitude) / 60
  vidElement.value.currentTime = time
}

async function getFrame(event: Event) {
  const canvas = document.createElement('canvas')
  canvas.width = vidElement.value.videoWidth
  canvas.height = vidElement.value.videoHeight
  const ctx = canvas.getContext("2d")
  ctx?.drawImage(vidElement.value, 0, 0, vidElement.value.videoWidth, vidElement.value.videoHeight)
  const dataURL = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = dataURL
  a.download = (prompt("Please enter a name:", "image") || "canvas-image") + ".png"
  a.click()
}

</script>

<template>
  <main>
    <input type="file" accept="video/*" @change="onInputChange($event)" />
    <br>
    <video ref="vidElement" :src="vidsrc" controls></video>
    <div>
      <button @click="onPlayPause($event)">Play/Pause</button>
      <br>
      <select @change="onPlaybackSpeedChange($event)">
        <option value="0.25">.25x</option>
        <option value="0.5">.50x</option>
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
        <option value="3">3x</option>
      </select>
      <br>
      <button @click="onNudge($event, 'left', 1)">-1</button>
      <button @click="onNudge($event, 'right', 1)">+1</button>
      <br>
      <button @click="onNudge($event, 'left', 5)">-5</button>
      <button @click="onNudge($event, 'right', 5)">+5</button>
      <br>
      <button @click="onNudge($event, 'left', 10)">-10</button>
      <button @click="onNudge($event, 'right', 10)">+10</button>
      <br>
      <button @click="getFrame($event)">Get Frame</button>

    </div>
  </main>
</template>

<style lang="css" scoped>
video {
  max-width: 90vw;
}
</style>
