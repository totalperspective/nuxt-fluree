<script setup lang="ts">
import { ref, watch, computed, useNuxtApp, useRuntimeConfig, Ref, onMounted } from '#imports'
import { ModuleOptions } from '~/../src/types'

const config = useRuntimeConfig().public.fluree as ModuleOptions

const { $fluree } = useNuxtApp()
const ledgers: Ref<string[]> = ref([])

async function refeshLedgers() {
  const list = await $fluree.ledgerList()
  console.log('refeshLedgers=', list.length)
  ledgers.value = list
}

async function createDefaultLedger() {
  try {
    const result = await $fluree.newLedger(config.ledger)
    console.log('createDefaultLedger', result)
    await refeshLedgers()
  } catch (err) {
    console.error(err)
  }
}

const colls: Ref<any[]> = ref([])

watch(ledgers, async (ledgers) => {
  console.log('ledger count', ledgers.length)
  if (!ledgers.length) {
    return
  }
  const db = await $fluree.db()
  console.log('db', db)
  const result = (await $fluree.query(db, {
    select: ['*'],
    from: '_collection',
  })) as object[]

  console.log('query result', result.length)
  colls.value = result
})

onMounted(() => {
  return refeshLedgers()
})

const eventString = computed(() => {
  const event = $fluree?.event as Ref<unknown>
  if (!event) {
    return ''
  }
  return JSON.stringify(event.value, null, 2)
})
</script>
<template>
  <div>
    <h1>Nuxt Fluree</h1>
    <textarea v-model="eventString" disabled></textarea>
    <section>
      <h2>Config</h2>
      <table>
        <tbody>
          <tr v-for="[key, val] in Object.entries(config)" :key="'config-' + key">
            <th>{{ key }}</th>
            <td>{{ val }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h2>Ledgers</h2>
      <button @click="createDefaultLedger()">Create Default Ledger</button>
      <ul>
        <li v-for="[network, ledger] in ledgers" :key="network + '_' + ledger">{{ network }}/{{ ledger }}</li>
      </ul>
    </section>
    <section>
      <h2>Collections</h2>
      <ul>
        <li v-for="coll in colls" :key="coll">{{ coll }}</li>
      </ul>
    </section>
  </div>
</template>
