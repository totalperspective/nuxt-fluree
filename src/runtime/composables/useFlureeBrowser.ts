import { useFetch, toRaw } from '#imports'
import type { ModuleOptions } from '../../module'

let conn: any = undefined

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

  const query = async (db: Object, query: Object) => flureedb.query(db, query)

  const viaServer = async (fn: String, args: Array<any>) => {
    console.log('fluree-browser', [fn, args])

    const { data, error } = await useFetch('/api/_fluree/exec', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: { fn, args },
    })

    if (!error.value) {
      console.log('fluree-browser', toRaw(data))
      return data
    }
    const err = toRaw(error)
    console.error(err)
    throw err
  }

  const makeServerFn =
    (fn: String) =>
    async (...args: Array<any>) =>
      await viaServer(fn, args)

  return {
    db,
    query,
    transact: makeServerFn('transact'),
    ledgerList: makeServerFn('ledgerList'),
    newLedger: makeServerFn('newLedger'),
  }
}
