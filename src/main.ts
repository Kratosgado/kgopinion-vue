import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './lib/router'
import { createHead } from '@vueuse/head'
import App from './App.vue'

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(createPinia())
app.use(router)
// app.config.errorHandler = (err) => {
//   console.log(`from handler: ${err}`)
// }

app.mount('#app')
