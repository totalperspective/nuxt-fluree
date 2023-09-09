// import type { Ref } from 'vue'
declare module '@fluree/flureedb'
declare module '@fluree/flureenjs'

interface FlureeDb {
  connect_p: Function
  connect: Function
  query: Function
  db: Function
}

interface FlureeImpl {
  db: Function
  query: Function
  transact: Function
  ledgerList: Function
  newLedger: Function
}

interface Win extends Window {
  flureedb: FlureeDb
}
