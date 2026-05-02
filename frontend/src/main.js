import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'
import router from './router'
import App from './App.vue'
import './assets/main.css'

// Cria o app Vue e injeta Apollo + Router
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(router)
app.mount('#app')
