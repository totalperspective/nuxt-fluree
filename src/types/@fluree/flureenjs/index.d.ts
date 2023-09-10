declare module '@fluree/flureenjs' {
  import type { Conn, ConnOpts, LedgerOpts, Listener, QueryOpts, QueryResult, TxOpts, TxResult } from '../api'
  import type { MultiQuery, Query } from '../query'
  import type { Tx } from '../tx'

  export default {
    connect,
    close,
    db,
    newLedger,
    deleteLedger,
    ledgerList,
    query,
    multiQuery,
    transact,
    monitorTx,
    listen,
    closeListener,
  }

  export function connect(server: string, opts?: ConnOpts): Promise<Conn>
  export function close(conn: Conn): boolean

  export function db(conn: Conn, ledger: string): DbSource

  export function newLedger(conn: Conn, ledger: string, opts?: LedgerOpts): Promise<TxResult>
  export function deleteLedger(conn: Conn, ledger: string): Promise<TxResult>
  export function ledgerList(conn: Conn): Promise<string[]>

  export function query(db: DbSource, query: Query, opts?: QueryOpts): Promise<QueryResult>
  export function multiQuery(
    db: DbSource,
    query: MultiQuery,
    opts?: QueryOpts,
  ): Promise<{
    [id: keyof MultiQuery]: QueryResult
  }>

  export function transact(conn: Conn, ledger: string, ts: Tx, opts?: TxOpts): Promise<TxResult>

  export function monitorTx(conn: Conn, ledger: string, txId: string, timeoutMs: number): Promise<unknown>

  export function listen(conn: Conn, ledger: string, key: string, callback: Listener): boolean
  export function closeListener(conn: Conn, ledger: string, key: string): boolean
}
