import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isLocalDeploy = env.VITE_LOCAL_DEPLOY === 'true';

    return {
      server: {
        port: 6620,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        isLocalDeploy && {
          name: 'inject-entry',
          transformIndexHtml(html: string) {
            // Remove importmap block
            html = html.replace(
              /<script type="importmap">[\s\S]*?<\/script>/,
              ''
            );
            // Inject Vite entry point
            html = html.replace(
              '</body>',
              '  <script type="module" src="/index.tsx"></script>\n  </body>'
            );
            return html;
          },
        },
      ].filter(Boolean),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});