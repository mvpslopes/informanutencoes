import { copyFile, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** Copia a pasta `api` (irmã de `app/`) para `dist/api` após o build. */
function copyApiToDist() {
  return {
    name: 'copy-api-to-dist',
    async closeBundle() {
      const src = resolve(__dirname, '../api')
      const dest = resolve(__dirname, 'dist/api')
      if (!existsSync(src)) {
        console.warn('[copy-api-to-dist] Pasta não encontrada:', src)
        return
      }
      await cp(src, dest, { recursive: true, force: true })
      const destConfig = resolve(dest, 'config.php')
      const srcConfig = resolve(src, 'config.php')
      const srcExample = resolve(src, 'config.example.php')
      if (!existsSync(srcConfig) && existsSync(srcExample) && !existsSync(destConfig)) {
        await copyFile(srcExample, destConfig)
        console.log(
          '[copy-api-to-dist] Criado dist/api/config.php a partir de config.example.php — defina a senha MySQL no servidor.',
        )
      }
      console.log('[copy-api-to-dist] Copiado para', dest)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyApiToDist()],
  server: {
    proxy: {
      // PHP local: php -S localhost:8888 -t ../api (na pasta api)
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
