type Instant = Date
type Json = object

export type TwoTuple = [string, string]
export type Id = number | string | TwoTuple

export type Ref = Entity | Id
type RefOrType<Type> = Ref | Type
export type Multi<Type> = RefOrType<Type> | RefOrType<Type>[]
export type PredicateValue = string | number | Buffer | object | bigint | EntityMap

export interface Entity {
  _id: Id
}

export type EntityMap = Entity & {
  [key: string]: Multi<PredicateValue>
}

export interface Collection extends Entity {
  name: string
  doc?: string
  spec?: Multi<Fn>
  specDoc?: string
  version?: string
  predicates: Multi<Predicate>
}

export enum PredicateType {
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

export interface Predicate extends Entity {
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

export interface User extends Entity {
  username?: string
  auth?: Multi<Auth>
  roles?: Multi<Role>
}

export interface Auth extends Entity {
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

export interface Role extends Entity {
  id?: string
  doc?: string
  rule?: Multi<Rule>
}

export interface Rule extends Entity {
  id?: string
  doc?: string
  collection: string
  collectionDefault?: boolean
  predicates?: Multi<string>
  fns: Multi<Fn>
  ops: Multi<Tag>
  errorMessage?: string
}

export interface Fn extends Entity {
  name: string
  params?: Multi<string>
  code: string
  doc?: string
  language?: Lang
  // spec?: Map<string, Spec>
}

export interface Block extends Entity {
  number: number
  hash: string
  prevHash: string
  transactions: Tx[]
  ledgers: string[]
  instant: Instant
  sigs: string[]
}

export interface Tx extends Entity {
  tempids: Map<string, number[]>
  sig: string
  tx: Json
  doc: string
  altId: string
  nonce: string
  authority: Auth
  auth: Auth
}

export interface Tag extends Entity {
  id: string
  doc?: string
}

export interface Setting extends Entity {
  id: string
  doc?: string
  language: Lang
  consensus: string
  txMax?: number
  anonymous: Auth
  ledgers: Auth[]
}

export enum Lang {
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
