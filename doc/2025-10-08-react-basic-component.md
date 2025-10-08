---
title: react - 基本元件
date: 2025-10-08T16:00:00.000+00:00
lang: zh-tw
lastUpdated: 2026-10-08
duration: 10min
---

## 基本寫法

用一般的 JavaScript function 來建立元件，元件名稱需要 **大寫開頭**（這是 React 的慣例，避免與一般函式搞混）。

```jsx
function BasicComponent() {
  return (
    <>
      <div>BasicComponent</div>
    </>
  )
}

export default BasicComponent
```

- return 後面包的是 JSX 語法，看起來像 HTML 但其實是 JavaScript。

- 以上面的例子 `<>...</>` 叫做 React Fragment（片段），它的作用是：
  - 當作一個看不見的容器，用來包裹多個元素
  - 不會在實際的 DOM 中產生額外的節點
  - 如果你用 `<div>` 包，瀏覽器檢查時會看到真的 div，但用 Fragment 就不會。

## JSX 背後的運作原理

雖然我們寫的是像 HTML 的 JSX 語法，但瀏覽器其實看不懂 JSX，所以需要透過 Babel 這類工具把 JSX 轉譯成瀏覽器看得懂的 JavaScript。

我們寫的 JSX：

```jsx
function BasicComponent() {
  return (
    <>
      <div>BasicComponent</div>
    </>
  )
}
```

實際轉譯後的 JavaScript：

```javascript
import {jsx as _jsx, Fragment as _Fragment} from 'react/jsx-runtime'

function BasicComponent() {
  return _jsx(_Fragment, {
    children: _jsx('div', {
      children: 'BasicComponent',
    }),
  })
}
```

[可以到 babeljs 查看轉譯的結果](https://babeljs.io/repl#?config_lz=N4IgZglgNgpgdgQwLYxALhAJxgBygOgCsBnADxABoQdtiYAXY9AbWZHgDdLR6FMBzBkwwATGGAQBXKIwoACOAHt6ciDDkBGDfKUq1AfSSKARpo2UQRkdJjCJUOlWOT-kUrfT1MkmAF8AuhRs2AgAxvTcWJJw9BAo6CBS9IpICLGhIAFBIMS8ggC0AEyRYqGKmGnlxABqMJjEEIpwCYUADIUAzPlaFjgQODBQEHAwAAqYijiKxAhQCQAWYQDWmf6BOYqSmKEwACoAngMJVjaZQA&code_lz=GYVwdgxgLglg9mABAIQIYGcYQMJwLYAOCApmFABQCUiA3gFCKIBOxUITS5DjiAPAHzcefACYwAbvzSYc-ImFJReAejGShfZYMaU6AXyA&lineWrap=true&version=7.28.4)

## 命名規則：React camelCase vs Vue kebab-case

### 核心差異

**React (JSX)：使用 camelCase**

```jsx
<MyButton userName="Eric" isActive={true} onClick={handleClick} maxWidth={200} />
```

Vue (Template)：使用 kebab-case

```vue
<MyButton user-name="Eric" :is-active="true" @click="handleClick" :max-width="200" />
```

為什麼會有這個差異？
React：JSX 是 JavaScript
JSX 會被編譯成 JavaScript 物件：

```jsx
// 你寫的 JSX
<div className="box" onClick={handler} />
```

```jsx
// 編譯後的 JavaScript
jsx('div', {
  className: 'box',
  onClick: handler,
})
```

因為最終是 JavaScript 物件的屬性，所以使用 JavaScript 的慣例：camelCase。

Vue：Template 是 HTML
Vue 的模板更接近 HTML，而 HTML 有個重要特性：不區分大小寫

```html
<!-- 在瀏覽器中，這三個是一樣的 -->
<div userName="Eric"></div>
<div username="Eric"></div>
<div USERNAME="Eric"></div>

<!-- 瀏覽器都會解析成 -->
<div username="Eric"></div>
```

### 結論

**React 和 Vue 的命名差異本質上反映了它們的設計哲學：**

- **React：JSX 就是 JavaScript**  
  因為 JSX 最終會編譯成 JavaScript 物件，所以直接採用 JavaScript 的命名慣例 `camelCase`，保持語言一致性。

- **Vue：Template 接近 HTML**  
  因為 HTML 不區分大小寫，使用 `kebab-case` 可以避免大小寫轉換問題，同時符合 Web 標準和 HTML 的書寫習慣。

**沒有誰對誰錯，只是技術選擇不同。** React 選擇「完全 JavaScript 化」，Vue 選擇「貼近 HTML」。了解背後的原因，在兩個框架間切換時就不會感到困惑了！

> 💡 **實務建議**：無論使用哪個框架，遵循官方推薦的命名規範，保持團隊程式碼風格一致最重要。
