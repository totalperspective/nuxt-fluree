type Instant = Date
type Json = object

type TwoTuple = [string, string]
type Id = number | string | TwoTuple

type Ref = Entity | Id
type RefOrType<Type> = Ref | Type
type Multi<Type> = RefOrType<Type> | RefOrType<Type>[]
type PredicateValue = string | number | Buffer | object | bigint | EntityMap

interface Entity {
  _id: Id
}

type EntityMap = Entity & {
  [key: string]: Multi<PredicateValue>
}

interface Collection extends Entity {
  name: string
  doc?: string
  spec?: Multi<Fn>
  specDoc?: string
  version?: string
  predicates: Multi<Predicate>
}

enum PredicateType {
  string = 'string',
  Ref = 'ref',
  Tag = 'tag',
  Int = 'int',
  Long = 'long',
  BigInt = 'bigint',
  Float = 'float',
  Double = 'double',
  BigDec = 'bigdec',
  Instant = 'instant',
  boolean = 'boolean',
  Uri = 'uri',
  Uuid = 'uid',
  Bytes = 'bytes',
  Json = 'json',
}

interface Predicate extends Entity {
  collection: Collection
  name: string
  type: string
  doc?: PredicateType
  unique?: boolean
  multi?: boolean
  index?: boolean
  upsert?: boolean
  noHistory?: boolean
  component?: boolean
  spec?: Multi<Fn>
  specDoc?: string
  depricated?: boolean
  txSpec?: Multi<Fn>
  txSpecDoc?: string
  restrictCollection?: string
  restrictTag?: boolean
  encrypted?: boolean
  fullText?: boolean
  retractDuplicates?: boolean
}

interface User extends Entity {
  username?: string
  auth?: Multi<Auth>
  roles?: Multi<Role>
}

interface Auth extends Entity {
  id?: string
  doc?: string
  key?: string
  type?: Tag
  secret?: string
  hashType?: Tag
  resetToken?: string
  roles?: Multi<Role>
  authority?: Multi<Auth>
  fuel: number
}

interface Role extends Entity {
  id?: string
  doc?: string
  rule?: Multi<Rule>
}

interface Rule extends Entity {
  id?: string
  doc?: string
  collection: string
  collectionDefault?: boolean
  predicates?: Multi<string>
  fns: Multi<Fn>
  ops: Multi<Tag>
  errorMessage?: string
}

interface Fn extends Entity {
  name: string
  params?: Multi<string>
  code: string
  doc?: string
  language?: Lang
  // spec?: Map<string, Spec>
}

interface Block extends Entity {
  number: number
  hash: string
  prevHash: string
  transactions: Tx[]
  ledgers: string[]
  instant: Instant
  sigs: string[]
}

interface Tx extends Entity {
  tempids: Map<string, number[]>
  sig: string
  tx: Json
  doc: string
  altId: string
  nonce: string
  authority: Auth
  auth: Auth
}

interface Tag extends Entity {
  id: string
  doc?: string
}

interface Setting extends Entity {
  id: string
  doc?: string
  language: Lang
  consensus: string
  txMax?: number
  anonymous: Auth
  ledgers: Auth[]
}

enum Lang {
  Arabic = 'ar',
  Bengali = 'bn',
  Chinese = 'cn',
  English = 'en',
  French = 'fr',
  Hindi = 'hi',
  Indonesian = 'id',
  BrazilianPortuguese = 'br',
  Russian = 'ru',
  Spanish = 'es',
}
