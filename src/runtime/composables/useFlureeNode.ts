import type { DbFn, FlureeImpl, LedgerListFn, ModuleOptions, NewLedgerFn, QueryFn, TransactFn } from '../../types'
import { Conn, QueryError } from '../../types/@fluree/api'

let conn: Conn

export async function useFlureeNode(config: ModuleOptions): Promise<FlureeImpl> {
  const { default: flureenjs } = await import('@fluree/flureenjs')
  const { server, ledger } = config

  if (!conn) {
    console.log('fluree-node', [server, ledger])
    conn = await flureenjs.connect(server)
    console.log('fluree-node', 'connected')
  }

  const ledgerList: LedgerListFn = async () => await flureenjs.ledgerList(conn)

  const newLedger: NewLedgerFn = async (ledger, options?) => await flureenjs.newLedger(conn, ledger, options)

  const db: DbFn = async () => await flureenjs.db(conn, ledger)

  const query: QueryFn = async (db, query) => {
    const result = (await flureenjs.query(db, query)) as QueryError
    if (result?.name === 'Error') {
      throw new Error(result.message)
    }
    return result
  }

  const transact: TransactFn = async (tx) => await flureenjs.transact(conn, ledger, tx)

  return { db, query, transact, ledgerList, newLedger }
}
