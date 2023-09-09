import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addServerHandler } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  server: string
  ledger: string
}

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
    nuxt.options.runtimeConfig.public.fluree = defu(nuxt.options.runtimeConfig.public.fluree, options)
    nuxt.options.runtimeConfig.fluree = defu(nuxt.options.runtimeConfig.fluree, options)

    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // addPlugin(resolve(runtimeDir, 'plugin'))
    addImportsDir(resolve(runtimeDir, 'composables'))

    addServerHandler({
      route: '/api/_fluree/exec',
      handler: resolve(runtimeDir, 'server/api/exec.post'),
    })

    addPlugin(resolve(runtimeDir, 'plugin'))
  },
})
