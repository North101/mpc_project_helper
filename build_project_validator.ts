import Ajv, { SchemaObject } from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import fs from 'node:fs/promises'
import path from 'node:path'
import TJS from 'typescript-json-schema'

const settings: TJS.PartialArgs = {
  required: true,
}

const compilerOptions: TJS.CompilerOptions = {
  alwaysStrict: true,
  strictNullChecks: true,
}

const sortObjectKeys = (key: string, value: unknown) => {
  if (!(value instanceof Object) || Array.isArray(value)) return value
  return Object.keys(value).sort().reduce((sorted, key) => {
    sorted[key] = value[key]
    return sorted
  }, {})
}

interface BuildSchema {
  filename: string
  type: string
}

interface SchemaResult extends BuildSchema {
  schema: SchemaObject
}

const buildSchema = async ({ filename, type }: BuildSchema): Promise<SchemaResult> => {
  const files = [
    filename,
  ]
  const program = TJS.getProgramFromFiles(files, compilerOptions, filename)
  return {
    filename,
    type,
    schema: TJS.generateSchema(program, type, settings, files)!,
  }
}

const writeSchemaJson = async ({ filename, schema }: { filename: string, schema: SchemaObject }) => {
  return fs.writeFile(filename, JSON.stringify(schema, sortObjectKeys, 2))
}

const toTypeDefinition = (filename: string) => {
  const parts = path.parse(filename)
  return path.format({
    ...parts,
    base: undefined,
    ext: 'd.ts',
  })
}

interface WriteSchemaValidator {
  filename: string
  schema: SchemaResult
  ref: string
}

const writeSchemaValidator = async ({ filename, schema, ref }: WriteSchemaValidator) => {
  const ajv = new Ajv({
    schemas: [schema.schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    [ref]: '#',
  })
  await fs.writeFile(
    filename,
    moduleCode,
  )
  await writeSchemaValidatorType({
    filename,
    schema,
    ref: ref,
  })
}

const writeSchemaValidatorType = async ({ filename, schema, ref: name }: WriteSchemaValidator) => {
  await fs.writeFile(
    toTypeDefinition(filename),
    [
      `import { ${schema.type} } from './${path.relative(path.dirname(filename), schema.filename)}'`,
      ``,
      `export declare function ${name}(data: unknown): data is ${schema.type};`,
      ``,
    ].join('\n'),
  )
}

const typesPath = 'src/types/projects'
await writeSchemaValidator({
  schema: await buildSchema({
    filename: path.resolve(typesPath, 'union.ts'),
    type: 'ProjectUnion',
  }),
  filename: path.resolve(typesPath, 'validate.js'),
  ref: 'validate',
})
