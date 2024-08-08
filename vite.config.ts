import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: resolve(__dirname, 'src/index.ts'),
      name:'hooks'
    },
    sourcemap: true,
    minify: true,
    target:'es6',
    rollupOptions:{
      external:['react', 'react-dom'],
      output:{
        globals:{
          react:'React',
          'react-dom': 'ReactDOM'
        }
      }

      
    }
    
  },
  
  
  plugins: [react(), dts({include: ['src'], exclude: ['**/*/tests.ts']})],

})

