// POT API 客户端
// 配置保存在 localStorage，键名: 'pot-utools-config'
// 默认配置:
// {
//   potApiUrl: 'http://127.0.0.1:60828', // POT 默认端口
// }

export function getPotConfig() {
  try {
    const config = JSON.parse(localStorage.getItem('pot-utools-config') || '{}')
    // 使用默认配置，如果用户没有配置过
    return {
      potApiUrl: 'http://127.0.0.1:60828',
      ...config
    }
  } catch (e) {
    console.error('读取配置失败，使用默认配置', e)
    return {
      potApiUrl: 'http://127.0.0.1:60828'
    }
  }
}

export function savePotConfig(config) {
  try {
    localStorage.setItem('pot-utools-config', JSON.stringify(config))
    return true
  } catch (e) {
    console.error('保存配置失败', e)
    return false
  }
}

// 获取POT截图缓存路径
export function getPotScreenshotPath() {
  const cacheDir = window.utools ? window.utools.getPath('cache') : ''
  const appCacheDir = `${cacheDir}/com.pot-app.desktop`
  return `${appCacheDir}/pot_screenshot_cut.png`
}

// 保存base64图片到POT缓存目录
export async function saveScreenshotToPotCache(base64) {
  const screenshotPath = getPotScreenshotPath()
  // 使用预加载的 services 来写入文件
  const result = window.services.writeImageToPath(base64, screenshotPath)
  // 添加一点延迟，确保文件完全写入磁盘，避免POT读到旧缓存
  await new Promise(resolve => setTimeout(resolve, 200))
  return result
}

// 调用POT OCR识别
// POT会自己弹出窗口显示结果，不需要我们处理结果
export async function potOcrRecognize() {
  const config = getPotConfig()
  const url = `${config.potApiUrl}/ocr_recognize`

  // 发送请求，不需要等待结果
  // POT会自己弹出窗口处理
  await fetch(url).catch(e => {
    console.error('POT OCR调用失败', e)
    throw e
  })
}

// 调用POT截图翻译
// POT会自己弹出窗口显示结果，不需要我们处理结果
export async function potOcrTranslate() {
  const config = getPotConfig()
  const url = `${config.potApiUrl}/ocr_translate`

  // 发送请求，不需要等待结果
  // POT会自己弹出窗口处理
  await fetch(url).catch(e => {
    console.error('POT截图翻译调用失败', e)
    throw e
  })
}

// 调用POT文本翻译
// POT会自己弹出窗口显示结果，不需要我们处理结果
export async function potTranslate(text) {
  const config = getPotConfig()
  const url = `${config.potApiUrl}/translate`

  // 发送请求，不需要等待结果
  // POT会自己弹出窗口处理
  await fetch(url, {
    method: 'POST',
    body: text
  }).catch(e => {
    console.error('POT翻译调用失败', e)
    throw e
  })
}
