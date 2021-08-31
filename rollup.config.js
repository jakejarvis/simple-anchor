import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import eslint from "@rollup/plugin-eslint";
import filesize from "rollup-plugin-filesize";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";

const banner = `/*! Simple Anchor v${pkg.version} | MIT License | https://github.com/jakejarvis/simple-anchor */`;

export default [
  {
    // universal (browser and node)
    input: "src/index.js",
    output: [
      {
        name: "SimpleAnchor",
        file: "dist/simple-anchor.js",
        format: "umd",
        exports: "named",
        esModule: false,
        banner: banner,
      },
      {
        name: "SimpleAnchor",
        file: "dist/simple-anchor.min.js",
        format: "umd",
        exports: "named",
        esModule: false,
        plugins: [
          terser({
            format: {
              preamble: banner,
              ascii_only: true, // default icon symbol gets disfigured otherwise
            },
          }),
        ],
      },
    ],
    plugins: [
      del({ targets: "dist/*" }),
      copy({
        // clearly this isn't really typescript, so we need to manually copy the type definition file
        targets: [
          {
            src: "src/index.d.ts",
            dest: "dist",
            rename: "simple-anchor.d.ts",
          },
        ],
      }),
      resolve(),
      eslint(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-env"]],
        exclude: ["node_modules/**"],
      }),
      filesize(),
    ],
  },
  {
    // modules
    input: "src/index.js",
    output: [
      {
        // ES6 module (import)
        file: "dist/simple-anchor.esm.js",
        format: "esm",
        exports: "named",
        banner: banner,
      },
      {
        // commonjs (require)
        file: "dist/simple-anchor.cjs.js",
        format: "cjs",
        exports: "named",
        banner: banner,
      },
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: "bundled",
        exclude: ["node_modules/**"],
      }),
      filesize(),
    ],
  },
];
