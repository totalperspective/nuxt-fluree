export type Conn = {
  id: string
  close: () => void
  group: unknown | null
}

export type ConnOpts = {
  'keep-alive-fn'?: () => void
  private?: string
}

export type DbSource = {
  closed: boolean
}

export type TxResult = {
  status: number
  result: string
}

export type QueryError = {
  name: 'Error'
  message: string
}
export type QueryResult = QueryError | Object

export type LedgerOpts = unknown

export type TxOpts = unknown

export type QueryOpts = unknown

export type Listener = (object, object) => void
