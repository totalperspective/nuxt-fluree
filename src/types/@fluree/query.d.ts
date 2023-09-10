import type { Multi, Id } from './schema'

export type MultiQuery = {
  [id: string]: Query
}

export type Query = BasicSelectQuery | AnalyticalSelectQuery | BlockQuery | HistoryQuery

interface BasicSelect extends BasicQuery {
  select: SelectArray
}

interface BasicSelectOne extends BasicQuery {
  selectOne: SelectArray
}

interface BasicSelectDistinct extends BasicQuery {
  selectDistinct: SelectArray
}

type BasicSelectQuery = BasicSelect | BasicSelectOne | BasicSelectDistinct

interface BasicQuery {
  from?: Multi<Id>
  where?: Where[]
  block?: BlockRef
  opts?: BasicQueryOpts
}

type SelectArray = Predicate[]
type Predicate = '*' | string | PredicateMap | SubSelectOptions
interface PredicateMap {
  [key as string]: Predicate[]
}

interface SubSelectOptions {
  _as?: string
  _limit?: number
  _offset?: number
  _recur?: number
  _component?: boolean
  _orderBy?: Order
  _compact?: boolean
}

type Order = string | [Direction, string]
type Direction = Ascending | Decending
type Ascending = 'ASC' | 'asc'
type Decending = 'DESC' | 'desc'

type Where = string
type BlockRef = number | string

interface CommonQueryOpts {
  limit?: number
  offset?: number
  orderBy?: Order
}

interface AnalyticalQueryOpts extends CommonQueryOpts {
  component?: boolean
  compact?: boolean
  syncTo?: number
  syncTimout?: number
}

interface AnalyticalSelect extends AnalyticalQuery {
  select: SelectArray
}

interface AnalyticalSelectOne extends AnalyticalQuery {
  selectOne: SelectArray
}

interface AnalyticalSelectDistinct extends AnalyticalQuery {
  selectDistinct: SelectArray
}

type AnalyticalSelectQuery = AnalyticalSelect | AnalyticalSelectOne | AnalyticalSelectDistinct

interface AnalyticalQuery {
  where: Clause[]
  block?: BlockRef
  prefixes?: PrefixMap
  vars?: VasriableMap
  opts?: AnalyticalQueryOpts
}

type SelectItem = Variable | VariableSelect | Aggregate
type Variable = string
type VariableSelect = {
  [key: Variable]: SelectArray
}
type Aggregate = string

type Clause = FlakePattern | BindingTuple | BindingMap | OptionalMap | UnionMap | FilterMap
type FlakePattern = [SourcePattern?, SubjectPattern, PredicatePattern, ObjectPattern]

type SourcePattern = string
type SubjectPattern = Variable | Id | null
type PredicatePattern = PredicateName | '_id' | Variable | ServiceCall
type PredicateName = string

type ServiceCall = 'rdf:type' | FullTextSearch<I>
type FullTextSearch<I extends string> = `fullText:${I}`

type ObjectPattern = PredicateValue | Variable

type BindingTuple = [Variable, Binding]
type Binding = string

type BindingMap = {
  bind: {
    [v: Variable]: Binding
  }
}

type OptionalMap = {
  optional: Where[]
}

type UnionMap = {
  union: [Where[], Where[]]
}

type FilterMap = {
  filter: FilterFn[]
}

type FilterFn = string

type PrefixMap = {
  [k: string]: string
}

type VasriableMap = {
  [k: Variable]: string
}

interface AnalyticalQueryOpts extends CommonQueryOpts {
  groupBy?: Multi<Variable>
  prettyPrint?: boolean
  wikidataOpts?: WikidataOpts
}

interface WikidataOpts {
  distinct?: boolean
  limit?: number
  offset?: number
  language?: string
}

interface BlockQuery {
  block: Multi<number> | string
  prettyPrint?: boolean
}

interface HistoryQuery {
  history: number | TwoTuple | FlakeFormat
  block?: Multi<number>
  showAuth?: boolean
  auth?: AuthRef[]
  prettyPrint?: boolean
}

type FlakeFormat = [Id, string?, PredicateValue?] | [Id | null, string, PredicateValue?]

type AuthRef = number | string
