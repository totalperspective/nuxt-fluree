import type { ModuleOptions } from '../../module'

let conn: any = undefined

export async function useFlureeNode(config: ModuleOptions): Promise<FlureeImpl> {
  const { default: flureenjs } = await import('@fluree/flureenjs')
  const { server, ledger } = config

  if (!conn) {
    console.log('fluree-node', [server, ledger])
    conn = await flureenjs.connect(server)
  }

  console.log('fluree-node', 'connected')

  const ledgerList = async () => await flureenjs.ledgerList(conn)

  const newLedger = async (ledger: String, options: unknown) => await flureenjs.newLedger(conn, ledger, options)

  const db = async () => await flureenjs.db(conn, ledger)

  const query = async (db: Object, query: Object) => {
    const result = await flureenjs.query(db, query)
    if (result?.name === 'Error') {
      throw new Error(result.message)
    }
    return result
  }

  const transact = async (tx: Object) => await flureenjs.transact(conn, ledger, tx)

  return { db, query, transact, ledgerList, newLedger }
}
