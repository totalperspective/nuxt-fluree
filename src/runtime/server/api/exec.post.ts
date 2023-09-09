import { defineEventHandler, readBody } from 'h3'
import { useFluree } from '../../composables/useFluree'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { fluree: config } = useRuntimeConfig()
  const { fn, args } = await readBody(event)
  const fluree = await useFluree(config)

  return await fluree[fn](...args)
})
