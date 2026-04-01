<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getPotConfig, savePotConfig } from '../utils/potClient'

const props = defineProps({
  enterAction: {
    type: Object,
    required: true
  }
})

const potApiUrl = ref('')
const saving = ref(false)
const saved = ref(false)

onMounted(() => {
  const config = getPotConfig()
  potApiUrl.value = config.potApiUrl
})

const saveSettings = () => {
  saving.value = true
  saved.value = false

  const config = {
    potApiUrl: potApiUrl.value.trim()
  }

  const success = savePotConfig(config)
  saving.value = false

  if (success) {
    saved.value = true
    window.utools?.showNotification('配置保存成功')
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } else {
    window.utools?.showNotification('配置保存失败')
  }
}
</script>

<template>
  <div class="settings">
    <h1>POT OCR/翻译 设置</h1>
    <div class="setting-item">
      <label for="potApiUrl">POT API 地址</label>
      <p class="hint">默认地址: http://127.0.0.1:60828，如果 POT 修改了端口请对应修改</p>
      <input
        v-model="potApiUrl"
        id="potApiUrl"
        type="text"
        placeholder="http://127.0.0.1:60828"
      >
    </div>
    <button @click="saveSettings" :disabled="saving">
      {{ saving ? '保存中...' : saved ? '已保存' : '保存设置' }}
    </button>
    <div class="info">
      <h3>使用说明</h3>
      <ul>
        <li>需要事先安装 POT 桌面应用: <a href="https://github.com/pot-app/pot-desktop" target="_blank">pot-app/pot-desktop</a></li>
        <li>在 POT 设置中启用外部调用，并确认端口一致</li>
        <li>本插件会将截图保存到 POT 指定的缓存目录，然后调用 POT 的 OCR/翻译接口</li>
        <li>功能包括: 截图OCR、截图翻译、输入翻译</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.settings {
  padding: 10px 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.setting-item {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.hint {
  color: #888;
  font-size: 12px;
  margin: 4px 0 8px;
}

input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  input {
    background-color: #444;
    border-color: #555;
    color: #fff;
  }

  .hint {
    color: #aaa;
  }
}

button {
  width: 100%;
  max-width: 200px;
  font-size: 16px;
  border-radius: 4px;
}

.info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

@media (prefers-color-scheme: dark) {
  .info {
    border-top-color: #444;
  }
}

.info h3 {
  margin-top: 0;
  font-size: 18px;
}

.info ul {
  padding-left: 20px;
  line-height: 1.8;
}

.info a {
  color: var(--blue);
}
</style>
