# AGENTS.md

# 本仓库智能代码代理开发指南

本文档为在这个 uTools Vue 3 插件项目上工作的智能代码代理提供指南。

## 构建、代码检查和测试命令

这是一个轻量级项目，工具配置最少：

### 可用命令

```bash
# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

### 当前状态

- **未配置代码检查**：当前项目没有设置 ESLint、Prettier 或其他代码检查工具
- **没有测试框架**：没有配置任何测试（没有 Jest、Vitest 等）
- **没有可用的单个测试命令**：由于项目中没有测试，因此无法运行单个测试
- **类型检查**：TypeScript 未完全配置，仅提供了 utools API 的类型定义

如果您添加了测试或代码检查，请使用适当的命令更新此部分。

## 代码风格指南

请遵循此代码库中现有的约定：

### 导入

- 所有导入使用单引号
- Vue 3 使用 `script setup` 语法的组合式 API
- 按以下顺序组织导入：
  1. Vue 核心导入
  2. 第三方库
  3. 本地组件
- 组件导入遵循 `./ComponentName/index.vue` 模式（每个目录一个组件）

示例：
```javascript
import { onMounted, ref } from 'vue'
import Hello from './Hello/index.vue'
```

### 格式化

- **缩进**：使用 2 个空格缩进（不使用制表符）
- **引号**：JavaScript/TypeScript 使用单引号，HTML 属性使用双引号
- **分号**：行尾可以省略分号 - 遵循现有风格
- **换行**：每行一个语句，每个代码块后换行
- **最大行长度**：没有严格限制，保持代码可读即可
- **入口点 `main.js`** 有意保持最小化

### 类型

- 可以在 Vue 组件的 script 标签中使用 `lang="ts"` 来使用 TypeScript
- 在遵循现有模式时，使用 `defineProps` 运行时类型定义而不是 TypeScript 接口
- 项目包含 `utools-api-types` 用于 utools API 类型定义
- 当前不强制严格 TypeScript 检查

示例：
```javascript
defineProps({
  enterAction: {
    type: Object,
    required: true
  }
})
```

### 命名约定

- **组件**：目录名使用 PascalCase（Hello、Read、Write），组件文件名始终使用 `index.vue`
- **变量**：JavaScript 变量使用 camelCase
- **Props**：prop 名称使用 camelCase
- **CSS 类**：类名使用 kebab-case
- **文件**：遵循 Vue 组件约定

示例：
```
src/
├── MyComponent/
│   └── index.vue
└── OtherComponent/
    └── index.vue
```

### 错误处理

- 对可能失败的操作（文件 I/O、API 调用等）使用 try/catch 块
- 捕获错误并向用户适当显示
- 使用 `utools.showNotification` 向用户发送错误通知
- 显示错误时将错误状态存储在组件 refs 中
- 对卫语句使用提前返回

示例：
```javascript
try {
  const content = window.services.readFile(_filePath)
  fileContent.value = content
} catch (err) {
  error.value = err.message
  fileContent.value = ''
}
```

### 框架特定（Vue 3）

- 始终使用**带 `script setup` 的组合式 API**（这是此项目唯一使用的模式）
- 使用 `ref` 处理响应式状态
- 使用 `onMounted` 处理初始化逻辑
- 使用 `watch` 响应 prop 变化，需要时添加 `immediate: true`
- 此代码库不使用 Options API - 不要引入它

示例：
```vue
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### CSS/样式

- 编写组件样式时使用 scoped CSS
- 项目在 `src/main.css` 中支持全局深色/浅色模式
- 遵循现有配色方案保持一致性

## 项目结构

```
├── config/            # 配置文件
├── public/            # 静态资源
├── src/
│   ├── components/    # 组件（每个目录一个）
│   ├── App.vue        # 根组件
│   ├── main.js        # 入口点
│   └── main.css       # 全局样式
├── package.json       # 依赖和脚本
├── vite.config.js     # 构建配置
└── jsconfig.json      # JS/TS 配置
```

## 关键提示

- 这是一个 **uTools 插件** 项目 - 构建必须使用相对路径（vite 配置中的 `base: './'`）
- 项目是一个 ES 模块（package.json 中的 `"type": "module"`）
- 使用 Vite 和 Vue 3 构建
- 访问 utools API 时遵循 uTools 插件开发最佳实践

## 现有配置

- 未找到 Cursor 规则
- 未找到 GitHub Copilot 说明
- 全局配置：`config/global.json` - `{"language": "zh-CN"}`（对话使用中文）
