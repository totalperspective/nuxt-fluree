<script setup>
import { ref, isRef, watch, effectScope, toRaw, computed, useNuxtApp, useRuntimeConfig } from '#imports'

const { fluree: config } = useRuntimeConfig().public

const { $fluree } = useNuxtApp()
const ledgers = ref([])
async function refeshLedgers() {
  const scope = effectScope()

  scope.run(async () => {
    const list = await $fluree.ledgerList()
    if (!isRef(list)) {
      console.log('refeshLedgers=', list?.length)
      ledgers.value = list || []
      return
    }
    watch(list, (value) => {
      const list = toRaw(value)
      console.log('refeshLedgers=', list?.length)
      ledgers.value = list || []
    })
  })
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

await refeshLedgers()

const colls = ref([])

watch(ledgers, async (ledgers) => {
  console.log('ledger count', ledgers.length)
  if (!ledgers.length) {
    return
  }
  const db = await $fluree.db()
  const result = await $fluree.query(db, {
    select: ['*'],
    from: '_collection',
  })
  console.log('query result', result.length)
  colls.value = result
})

const eventString = computed(() => JSON.stringify($fluree?.event?.value, null, 2))
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
