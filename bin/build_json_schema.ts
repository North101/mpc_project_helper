import Ajv, { SchemaObject } from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import { program } from 'commander'
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

const writeSchemaJson = async ({ filename, schema }: { filename: string, schema: SchemaResult }) => {
  return fs.writeFile(filename, JSON.stringify(schema.schema, sortObjectKeys, 2))
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
  await fs.mkdir(path.dirname(filename), { recursive: true })
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
  const dir = path.relative(path.dirname(filename), path.dirname(schema.filename))
  await fs.writeFile(
    toTypeDefinition(filename),
    [
      `import { ${schema.type} } from '${dir.startsWith('..') ? '' : './'}${dir ? `${dir}/` : ''}${path.basename(schema.filename)}'`,
      ``,
      `export declare function ${name}(data: unknown): data is ${schema.type};`,
      ``,
    ].join('\n'),
  )
}

program
  .name('build_json_schema')

program
  .command('validator <input> <type> <output> <ref>')
  .action(async (input, type, output, ref) => {
    await writeSchemaValidator({
      schema: await buildSchema({
        filename: path.resolve(input),
        type: type,
      }),
      filename: path.resolve(output),
      ref: ref,
    })
  })

program
  .command('json <input> <type> <output>')
  .action(async (input, type, output) => {
    await writeSchemaJson({
      schema: await buildSchema({
        filename: path.resolve(input),
        type: type,
      }),
      filename: path.resolve(output),
    })
  })

program.parse()
