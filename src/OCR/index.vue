<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { potOcrRecognize } from '../utils/potClient'

const props = defineProps({
  enterAction: {
    type: Object,
    required: true
  }
})

const loading = ref(false)
const error = ref('')

const callPotOcr = async () => {
  loading.value = true
  error.value = ''

  try {
    // 直接调用 POT OCR，POT会自己截图并显示结果
    await potOcrRecognize()
    // 调用完成后隐藏uTools窗口
    window.utools?.hideMainWindow()
  } catch (err) {
    error.value = err.message
    console.error('OCR调用出错', err)
    window.utools?.showNotification(`OCR出错: ${err.message}`)
  }

  loading.value = false
}

onMounted(() => {
  // 检查是否是图片输入（用户拖入/粘贴图片)
  const payload = props.enterAction.payload
  if (payload && payload.type === 'img') {
    // 用户拖入或粘贴图片，需要保存到POT缓存再调用
    import('../utils/potClient').then(({ saveScreenshotToPotCache }) => {
      saveScreenshotToPotCache(payload.data).then(() => {
        potOcrRecognize().then(() => {
          window.utools?.hideMainWindow()
        })
      })
    })
  } else {
    // 直接调用 POT，让 POT 自己截图
    callPotOcr()
  }
})
</script>

<template>
  <div class="ocr">
    <h1>截图 OCR (POT)</h1>

    <div v-if="loading" class="loading">
      <p>正在调用 POT...</p>
    </div>

    <div v-if="error" class="error">
      <p>错误: {{ error }}</p>
    </div>

    <div class="actions">
      <button @click="callPotOcr" :disabled="loading">
        {{ loading ? '调用中...' : '重新截图' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ocr {
  padding: 10px 20px;
}

h1 {
  font-size: 22px;
  margin-bottom: 15px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.loading p {
  margin-bottom: 15px;
}

.error {
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 4px;
  margin-bottom: 20px;
}

.error p {
  color: #d32f2f;
  margin: 0 0 0;
}

@media (prefers-color-scheme: dark) {
  .error {
    background-color: rgba(255, 0, 0, 0.15);
  }
}

.actions {
  text-align: center;
  padding-top: 10px;
}

button {
  min-width: 140px;
  border-radius: 4px;
}
</style>
