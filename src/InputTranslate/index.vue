<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { potTranslate } from '../utils/potClient'

const props = defineProps({
  enterAction: {
    type: Object,
    required: true
  }
})

const inputText = ref('')
const loading = ref(false)
const error = ref('')

const translate = async () => {
  if (!inputText.value.trim()) {
    error.value = '请输入需要翻译的文本'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await potTranslate(inputText.value.trim())
    // 调用完成后隐藏uTools窗口
    window.utools?.hideMainWindow()
  } catch (err) {
    error.value = err.message
    console.error('翻译出错', err)
    window.utools?.showNotification(`翻译出错: ${err.message}`)
  }

  loading.value = false
}

onMounted(() => {
  // 检查是否有输入文本
  const payload = props.enterAction.payload
  if (payload && payload.type === 'text') {
    // 用户输入的文本，直接翻译
    inputText.value = payload.data
    translate()
  }
})
</script>

<template>
  <div class="input-translate">
    <h1>输入翻译 (POT)</h1>

    <div class="input-container">
      <label for="inputText">输入待翻译文本</label>
      <textarea
        v-model="inputText"
        id="inputText"
        placeholder="请输入需要翻译的文本..."
        class="input-text"
      ></textarea>
      <button @click="translate" :disabled="loading || !inputText.trim()">
        {{ loading ? '翻译中...' : '翻译' }}
      </button>
    </div>

    <div v-if="error" class="error">
      <p>错误: {{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.input-translate {
  padding: 10px 20px;
}

h1 {
  font-size: 22px;
  margin-bottom: 15px;
}

.input-container {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.input-text {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.error {
  padding: 15px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 4px;
  margin-bottom: 15px;
}

.error p {
  color: #d32f2f;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .input-text {
    background-color: #444;
    border-color: #555;
    color: #fff;
  }

  .error {
    background-color: rgba(255, 0, 0, 0.15);
  }
}

button {
  min-width: 100px;
  border-radius: 4px;
}
</style>
