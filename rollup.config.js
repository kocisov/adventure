import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';

export default {
  dest: 'lib/index.js',
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'Adventure',
  plugins: [
    flow({
      all: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
