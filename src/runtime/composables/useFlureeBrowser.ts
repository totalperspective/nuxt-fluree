import { useFetch, toRaw, ref, isRef } from '#imports'
import type { ModuleOptions } from '../../module'

let conn: any = undefined

const fromRef = (r: any) => (isRef(r) ? r.value : r)

export async function useFlureeBrowser(config: ModuleOptions): Promise<FlureeImpl> {
  await import('@fluree/flureedb')
  const { flureedb } = window as unknown as Win
  const { server, ledger } = config

  if (!conn) {
    console.log('fluree-browser', [server, ledger])
    conn = flureedb.connect(server)
  }
  console.log('fluree-browser', 'Connected!')

  const db = async () => flureedb.db(conn, ledger)

  const query = async (db: Object, query: Object) => {
    const result = await flureedb.query(db, query)
    if (result?.name === 'Error') {
      throw new Error(result.message)
    }
    return result
  }

  const viaServer = async (fn: String, args: Array<any>) => {
    console.log('fluree-browser', 'viaServer', [fn, args])

    const { data, error } = await useFetch('/api/_fluree/exec', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: { fn, args },
    })

    if (!error.value) {
      console.log('fluree-browser', 'viaServer', data)
      return data
    }
    const err = toRaw(error)
    console.error(err)
    throw err
  }

  const makeServerFn =
    (fn: String) =>
    async (...args: Array<any>) => {
      const result = await viaServer(fn, args)
      const data: SuccesWithTx = fromRef(result)
      if (data?.status && data?.result) {
        return await flureedb.monitor_tx(conn, ledger, data.result, 10000)
      }
      return result
    }

  const event = ref({})
  const listenerKey = '$useFlureeBrowser$event'
  flureedb.close_listener(conn, ledger, listenerKey)
  const listen = flureedb.listen(conn, ledger, listenerKey, (type: Object, data: Object) => {
    console.log('fluree-browser', 'event', { type, data })

    event.value = { type, data }
  })
  console.log('fluree-browser', 'listen?', listen)

  return {
    db,
    query,
    transact: makeServerFn('transact'),
    ledgerList: makeServerFn('ledgerList'),
    newLedger: makeServerFn('newLedger'),
    event,
  }
}
