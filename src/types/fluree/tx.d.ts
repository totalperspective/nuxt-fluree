enum AssertAction {
  Add = 'add',
  Update = 'update',
  Upsert = 'upsert',
}
enum RetractAction {
  Delete = 'delete',
}

type Action = AssertAction | RetractAction

interface TransactKey extends Fluree.Entity {
  _action?: Action
}

type EntityAction = EntityMap & TransactKey

type TxMetaData = EntityAction & {
  _id: '_tx'
}

type Assertion<N extends string, I extends string & keyof C, C extends Entity> = C &
  TransactKey & {
    _id: N | [`${N}/${I}`, Id]
    _action: AssertAction
  }

type EntityAction =
  | Assertion<'collection', 'name', Collection>
  | Assertion<'predicate', 'name', Predicate>
  | Assertion<'user', 'username', User>
  | Assertion<'auth', 'id', Auth>
  | Assertion<'role', 'id', Role>
  | Assertion<'rule', 'id', Rule>
  | EntityAction

type DeleteAction = TransactKey & {
  _action: DeleteAction
}

type ActionItem = EntityAction | DeleteAction

type Tx = [...ActionItem[], TxMetaData] | [TxMetaData, ...ActionItem[]]
