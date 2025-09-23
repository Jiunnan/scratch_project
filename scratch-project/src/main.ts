import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'vue-color/style.css';

// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')