import react from '@vitejs/plugin-react-swc'
import fs from 'node:fs/promises'
import { PluginOption, ResolvedConfig, defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

const rmOutDir = (): PluginOption => {
  let viteConfig: ResolvedConfig

  return {
    name: 'vite-plugin-rm-outDir',
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig
    },
    async buildStart() {
      await fs.rm(viteConfig.build.outDir, {
        recursive: true,
        force: true,
      })
      await fs.mkdir(viteConfig.build.outDir, {
        recursive: true,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    rmOutDir(),
    react(),
    webExtension({
      transformManifest: (manifest) => {
        const pkg = readJsonFile('package.json')
        return {
          name: pkg.name,
          description: pkg.description,
          version: pkg.version,
          ...manifest,
        }
      },
    }),
  ],
})
