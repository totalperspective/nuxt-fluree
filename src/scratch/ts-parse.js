import ts from 'typescript'

const input = `
declare function description()

@description("A person's age")
interface Person {
  /**
   * @description Test 
   */
  name: string;

  age: number;
}
`
const node = ts.createSourceFile(
  'x.ts', // fileName
  input,
  ts.ScriptTarget.Latest, // langugeVersion
)
function walkNode(node, depth = 0) {
  node.forEachChild((child) => {
    const kind = ts.SyntaxKind[child.kind]
    const prefix = '..'.repeat(depth)
    console.log(prefix, kind, node)
    if (kind === 'Identifier') {
      console.log(prefix, '->', child.escapedText)
    }
    if (node.decorators) {
      console.log(prefix, '--', node.decorators)
    }
    walkNode(child, depth + 1)
  })
}
walkNode(node, 0)
