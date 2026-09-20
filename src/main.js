import { createApp } from 'vue'
import App from './App.vue'
import VueApexCharts from 'vue3-apexcharts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/global.css'
import './assets/main.css'

const app = createApp(App)

app.use(VueApexCharts)
app.use(ElementPlus)

app.mount('#app')
