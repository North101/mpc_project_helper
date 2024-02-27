import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
