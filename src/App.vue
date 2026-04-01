<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import OCR from './OCR/index.vue'
import InputTranslate from './InputTranslate/index.vue'
import ScreenshotTranslate from './ScreenshotTranslate/index.vue'
import Settings from './Settings/index.vue'

const route = ref('')
const enterAction = ref({})

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    route.value = action.code
    enterAction.value = action
  })
  window.utools.onPluginOut((isKill) => {
    route.value = ''
  })
})
</script>

<template>
  <template v-if="route === 'pot-ocr'">
    <OCR :enterAction="enterAction"></OCR>
  </template>
  <template v-if="route === 'pot-input-translate'">
    <InputTranslate :enterAction="enterAction"></InputTranslate>
  </template>
  <template v-if="route === 'pot-screenshot-translate'">
    <ScreenshotTranslate :enterAction="enterAction"></ScreenshotTranslate>
  </template>
  <template v-if="route === 'pot-settings'">
    <Settings :enterAction="enterAction"></Settings>
  </template>
</template>
