import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, async (args: any) => {
        return {
          loader: 'jsx',
          contents: input,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult: esbuild.OnLoadResult | null = await fileCache.getItem(
          args.path
        );

        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /\.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const contents = `
            const styleEl = document.createElement('style')
            styleEl.innerText = '${data
              .replaceAll(/\n/g, ' ')
              .replaceAll(/\./g, '\\.')}'
            document.head.appendChild(styleEl)
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
