import react from '@vitejs/plugin-react-swc'
import { glob } from 'glob'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import * as TJS from 'typescript-json-schema'
import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'
import Ajv from 'ajv'
import standaloneCode from "ajv/dist/standalone"

const settings: TJS.PartialArgs = {
  required: true,
}

const compilerOptions: TJS.CompilerOptions = {
  alwaysStrict: true,
  strictNullChecks: true,
}

const sortedKeys = (key: string, value: unknown) => {
  if (value instanceof Object && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = value[key];
        return sorted
      }, {})
  }
  return value
}

export const generateSchema = async (path: string) => {
  const files = await glob([
    resolve(path, 'v[0-9]*.ts'),
    resolve(path, 'union.ts'),
  ])
  const program = TJS.getProgramFromFiles(files, compilerOptions, path)
  const schema = {
    ...TJS.generateSchema(program, 'ProjectUnion', settings, files)
  }

  const ajv = new Ajv({
    schemas: [schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    validate: '#',
  })
  fs.writeFile(resolve(path, 'validate.js'), moduleCode)
}


function generateManifest() {
  const manifest = readJsonFile('manifest.json')
  const pkg = readJsonFile('package.json')
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: '',
      async writeBundle() {
        await generateSchema('src/types/projects')
      },
    },
    webExtension({
      manifest: generateManifest,
      disableAutoLaunch: true,
    }),
  ],
})
