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

  const ledgerList = async () => await flureenjs.ledgerList(await conn)

  const newLedger = async (ledger: String, options: unknown) => await flureenjs.newLedger(await conn, ledger, options)

  const db = async () => await flureenjs.db(await conn, ledger)

  const query = async (db: Object, query: Object) => await flureenjs.query(await db, query)

  const transact = async (tx: Object) => await flureenjs.transact(await conn, ledger, tx)

  return { db, query, transact, ledgerList, newLedger }
}
