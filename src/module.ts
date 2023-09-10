import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addServerHandler } from '@nuxt/kit'
import { defu } from 'defu'
import { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@totalperspective/fluree',
    configKey: 'fluree',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    server: 'http://127.0.0.1:8090',
    ledger: 'test/ledger',
  },
  setup(options, nuxt) {
    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.fluree = defu(nuxt.options.runtimeConfig.public.fluree as ModuleOptions, options)
    nuxt.options.runtimeConfig.fluree = defu(nuxt.options.runtimeConfig.fluree as ModuleOptions, options)

    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))
    // addPlugin(resolve(runtimeDir, 'plugin'))
    addImportsDir(resolve(runtimeDir, 'composables'))

    addServerHandler({
      route: '/api/_fluree/exec',
      handler: resolve(runtimeDir, 'server/api/exec.post'),
    })
  },
})
