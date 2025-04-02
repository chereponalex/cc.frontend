import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dynamicImport from 'vite-plugin-dynamic-import'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        'babel-plugin-macros'
      ]
    }
  }),
  dynamicImport()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process?.env?.BACKEND_URL || 'http://localhost:8000',
        // target: 'http://195.2.70.213',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  define: {
    __BACKEND_URL__: JSON.stringify(process?.env?.BACKEND_URL || 'http://localhost:8000'),
  },
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@ckeditor/ckeditor5-react': require.resolve('@ckeditor/ckeditor5-react'),
      '@ckeditor/ckeditor5-build-classic': require.resolve('@ckeditor/ckeditor5-build-classic')
    },
  },
  build: {
    outDir: 'build'
  }
});
