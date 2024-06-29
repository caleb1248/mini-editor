import { transform, Loader } from 'esbuild-wasm';

export const transformCode = async (code: string, loader: Loader) => {
  const result = await transform(code, {
    loader,
    target: 'es2015',
    sourcemap: 'both',
    sourcefile: 'main.ts',
  });

  return result;
};
