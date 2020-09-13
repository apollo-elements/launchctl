import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import rollupGraphql from '@kocal/rollup-plugin-graphql';
import rollupCommonjs from '@rollup/plugin-commonjs';

import rollupLitcss from 'rollup-plugin-lit-css';

const commonjs = fromRollup(rollupCommonjs);

const litcss = fromRollup(rollupLitcss);
const graphql = fromRollup(rollupGraphql);

export default {
  nodeResolve: true,
  port: 8090,
  appIndex: 'index.html',
  rootDir: '.',
  mimeTypes: {
    'src/components/**/*.graphql': 'js',
    'src/components/**/*.css': 'js',
    'src/style.css': 'css',
  },
  plugins: [
    esbuildPlugin({ ts: true }),
    commonjs(),
    graphql({ include: '**/*.graphql' }),
    litcss({
      include: 'src/components/**/*.css',
      exclude: 'src/style.css',
    }),
  ],
};
