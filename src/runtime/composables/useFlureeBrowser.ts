import axios from 'axios'
import type { FlureeImpl, TransactFn, NewLedgerFn, QueryFn, DbFn, LedgerListFn, ModuleOptions } from '../../types'
import type { Conn, QueryError, TxResult } from '../../types/@fluree/api'
import { ref } from '#imports'

let conn: Conn

export async function useFlureeBrowser(config: ModuleOptions): Promise<FlureeImpl> {
  await import('@fluree/flureedb')
  const { flureedb } = window
  const { server, ledger } = config

  if (!conn) {
    console.log('fluree-browser', [server, ledger])
    conn = flureedb.connect(server)
    console.log('fluree-browser', 'Connected!')
  }

  const db: DbFn = async () => await flureedb.db(conn, ledger)

  const query: QueryFn = async (db, query) => {
    const result = (await flureedb.query(db, query)) as QueryError
    if (result?.name === 'Error') {
      throw new Error(result.message)
    }
    return result
  }

  const viaServer = async (fn: String, args: Array<any>) => {
    console.log('fluree-browser', 'viaServer', [fn, args])
    const response = await axios({
      method: 'post',
      url: '/api/_fluree/exec',
      data: { fn, args },
    })
    console.log('fluree-browser', 'viaServer', response)
    return response.data
  }

  const makeServerFn =
    (fn: String) =>
    async (...args: Array<any>) => {
      const result = await viaServer(fn, args)
      console.log('fromServer', result)

      const data: TxResult = result
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
    transact: makeServerFn('transact') as TransactFn,
    ledgerList: makeServerFn('ledgerList') as LedgerListFn,
    newLedger: makeServerFn('newLedger') as NewLedgerFn,
    event,
  }
}
