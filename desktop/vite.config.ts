import { defineConfig } from 'vite'
import path, { resolve } from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // 👈 add this
import tsConfigPaths from "vite-tsconfig-paths"


// https://vitejs.dev/config/
export default defineConfig({
  build:{
    emptyOutDir: false,
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input:{
        main: resolve(__dirname, "index.html"),
        studio_main: resolve(__dirname, 'studio.html'),
        web_cam_main: resolve(__dirname, 'webcam.html'),
      }
    }

  },
  server:{
    proxy:{
      "/api": { 
        target: "http://localhost:3000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/,''),
      },
      
    },
  },



  plugins: [
    tailwindcss(),  // 👈 add this
    react(),
    tsConfigPaths(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})