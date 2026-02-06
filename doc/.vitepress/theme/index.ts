import DefaultTheme from 'vitepress/theme'
import CustomLayout from './CustomLayout.vue'
import HomePage from './components/HomePage.vue'
import './custom.css'

import type { Theme } from 'vitepress'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  },
}

export default theme
