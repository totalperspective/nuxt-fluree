// import type { Ref } from 'vue'
declare module '@fluree/flureedb'
declare module '@fluree/flureenjs'

interface FlureeDb {
  connect_p: Function
  connect: Function
  query: Function
  db: Function
  listen: Function
  monitor_tx: Function
  close_listener: Function
}

interface FlureeImpl {
  db: Function
  query: Function
  transact: Function
  ledgerList: Function
  newLedger: Function
  event?: Ref<Object>
}

interface Win extends Window {
  flureedb: FlureeDb
}

interface SuccesWithTx {
  status: Number
  result: String
}
