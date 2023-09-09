import { defineEventHandler, readBody } from 'h3'
import { useFluree } from '../../composables/useFluree'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { fluree: config } = useRuntimeConfig()
  const { fn, args } = await readBody(event)
  const fluree = await useFluree(config)
  console.log('fluree/exec', { fn, args })

  const result = await fluree[fn](...args)
  console.log('fluree/exec', result)
  return result
})
