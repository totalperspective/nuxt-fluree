import type { Conn, ConnOpts, DbSource, LedgerOpts, Listener, QueryOpts, QueryResult, TxOpts, TxResult } from '../api'
import type { MultiQuery, Query } from '../query'
import type { Tx } from '../tx'

export as namespace flureedb

export function connect_p(server: string, opts?: ConnOpts): Promise<Conn>
export function connect(server: string, opts?: ConnOpts): Conn
export function close(conn: Conn): boolean

export function db(conn: Conn, ledger: string): DbSource
export function db_schema(db: DbSource): Promise<Schema>

export function new_ledger(conn: Conn, ledger: string, opts?: LedgerOpts): Promise<TxResult>
export function delete_ledger(conn: Conn, ledger: string): Promise<TxResult>

export function query(db: DbSource, query: Query, opts?: QueryOpts): Promise<QueryResult>
export function multi_query(
  db: DbSource,
  query: MultiQuery,
  opts?: QueryOpts,
): Promise<{
  [id: keyof MultiQuery]: QueryResult
}>

export function transact(conn: Conn, ledger: string, ts: Tx, opts?: TxOpts): Promise<TxResult>

export function monitor_tx(conn: Conn, ledger: string, txId: string, timeoutMs: number): Promise<unknown>

export function listen(conn: Conn, ledger: string, key: string, callback: Listener): boolean
export function close_listener(conn: Conn, ledger: string, key: string): boolean
