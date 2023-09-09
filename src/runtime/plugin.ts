import { defineNuxtPlugin } from '#app'
import { useFluree, useRuntimeConfig } from '#imports'
import { ModuleOptions } from '../module'

export default defineNuxtPlugin({
  name: 'fluree-plugin',
  enforce: 'pre', // or 'post'
  async setup() {
    const { fluree: config } = useRuntimeConfig().public
    const fluree = await useFluree(config as ModuleOptions)
    return {
      provide: {
        fluree,
      },
    }
  },
  hooks: {
    // You can directly register Nuxt app hooks here
    // 'app:created'() {
    //   const nuxtApp = useNuxtApp()
    //   //
    // },
  },
})
