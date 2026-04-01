const fs = require('node:fs')
const path = require('node:path')
const { Buffer } = require('node:buffer')

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 读文件
  readFile (file) {
    return fs.readFileSync(file, { encoding: 'utf-8' })
  },
  // 文本写入到下载目录
  writeTextFile (text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },
  // 图片写入到下载目录
  writeImageFile (base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
    if (!matchs) return
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' })
    return filePath
  },
  // 图片base64写入到指定路径
  writeImageToPath (base64Url, targetPath) {
    const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const appCacheDir = path.dirname(targetPath)

    // 确保目录存在
    if (!fs.existsSync(appCacheDir)) {
      fs.mkdirSync(appCacheDir, { recursive: true })
    }

    // 删除旧文件，确保写入新截图
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }

    fs.writeFileSync(targetPath, buffer)
    return targetPath
  },
  // 确保目录存在
  ensureDir (dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }
}
