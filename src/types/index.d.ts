import type { DbSource, TxOpts, LedgerOpts } from './@fluree/api'
import type { Query } from './@fluree/query'
import type { Tx } from './@fluree/tx'

type DbFn = () => Promise<DbSource>

type QueryFn = (db: DbSource, query: Query) => Promise<object | object[]>

export type TransactFn = (tx: Tx, opts?: TxOpts) => Promise<TxResult>

export type LedgerList = string[]

export type LedgerListFn = () => Promise<LedgerList>

export type NewLedgerFn = (ledger: string, opets?: LedgerOpts) => Promose<TxResult>

export interface FlureeImpl {
  db: DbFn
  query: QueryFn
  transact: TransactFn
  ledgerList: LedgerListFn
  newLedger: NewLedgerFn
  event?: unknown
}
interface PluginsInjections {
  $fluree: FlureeImpl
}

declare global {
  interface NuxtApp extends PluginsInjections {}
}

// Module options TypeScript interface definition
export interface ModuleOptions {
  server: string
  ledger: string
}
