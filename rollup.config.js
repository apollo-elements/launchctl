import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@open-wc/rollup-plugin-html';
import graphql from '@apollo-elements/rollup-plugin-graphql';
import litcss from 'rollup-plugin-lit-css';
import esbuild from 'rollup-plugin-esbuild';
import { copy } from '@web/rollup-plugin-copy';

export default {
  // main entry point which loads the client and the app-shell components
  input: 'index.html',

  output: [{
    dir: 'build',
    format: 'es',
    sourcemap: true,
  }, {
    dir: 'build/nomodule',
    format: 'system',
    sourcemap: true,
  }],

  plugins: [
    esbuild({ ts: true, target: 'es2019' }),
    html(),
    resolve(),
    commonjs(),
    graphql(),
    litcss(),
    copy({
      patterns: [
        'src/*.css',
        'src/fonts/*',
      ],
    }),
  ],
};
