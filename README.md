# m-simple-calendar

多平台简单的日历

<p align="center">
    <a href="https://mineh5ui.biaov.cn/v2/doc/calendar">
        <img src="https://biaov.cn/static/calendar.svg" width="200px" title="mineh5ui" alt="mineh5ui">
    </a>
</p>

<h2 align="center">
  <a href="https://npmjs.com/package/m-simple-calendar"><img src="https://img.shields.io/npm/v/m-simple-calendar.svg?logo=npm" alt="m-simple-calendar" /></a>
  <a href="https://www.npmjs.com/package/m-simple-calendar"><img src="https://img.shields.io/npm/dt/m-simple-calendar?logo=Markdown" alt="m-simple-calendar" /></a>
  <a href="https://www.npmjs.com/package/m-simple-calendar"><img src="https://packagephobia.com/badge?p=m-simple-calendar" alt="m-simple-calendar" /></a>
  <a href="https://github.com/biaov/m-simple-calendar/blob/main/LICENSE"><img src="https://img.shields.io/github/license/biaov/m-simple-calendar.svg?logo=Unlicense" alt="m-simple-calendar" /></a>
</h2>

## 支持平台

- 微信小程序
- Vue3.x
- Vue2.x

## 参数文档

- [m-simple-calendar](https://wordpress.biaov.cn/mine-h5-ui/calendar.html)

## 使用

### Vue

#### 代码集成

- 复制 `/vue/m-simple-calendar` 文件夹到你的 components 里去
- 如果是 Vue2 复制 `/vue/m-simple-calendar-v2` 文件夹
- 使用: 按照正常组件使用即可

#### NPM 集成

```sh
npm i m-simple-calendar
```

##### Vue3.x

- 全局引用

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MSimpleCalendar from 'm-simple-calendar'

createApp(App).use(MSimpleCalendar).mount('#app')
```

- 按需引用

```vue
<template>
  <m-simple-calendar visible />
</template>
<script setup>
import { MSimpleCalendar } from 'm-simple-calendar'
</script>
```

##### Vue2.x

- 全局引用

```js
// main.js
import Vue from 'vue'
import MSimpleCalendar from 'm-simple-calendar/vue2'

Vue.use(MSimpleCalendar)
```

- 按需引入

```vue
<template>
  <m-simple-calendar visible />
</template>
<script>
import MSimpleCalendar from 'm-simple-calendar/vue2'

export default {
  components: {
    MSimpleCalendar
  }
}
</script>
```

### 微信小程序

#### 代码集成

- 复制 `/miniprogram/m-simple-calendar` 文件夹到你的 components 里去
- 使用:

```json
// demo.json
{
  "usingComponents": {
    "m-simple-calendar": "/components/m-simple-calendar/index"
  }
}
```

```html
<!-- demo.wxml -->
<m-simple-calendar visible />
```

#### NPM 集成

```sh
npm i m-simple-calendar
```

- `打开微信开发者工具` -> `工具` -> `构建 npm`

```json
// demo.json
{
  "usingComponents": {
    "m-simple-calendar": "m-simple-calendar/m-simple-calendar/index"
  }
}
```

```html
<!-- demo.wxml -->
<m-simple-calendar visible />
```

## 贡献者们

[![贡献者们](https://contrib.rocks/image?repo=biaov/m-simple-calendar)](https://github.com/biaov/m-simple-calendar/graphs/contributors)