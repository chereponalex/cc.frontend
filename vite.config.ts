import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
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
