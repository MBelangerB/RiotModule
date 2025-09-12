import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/riotmodule.ts'],
    outDir: 'build', // 'distPackage',
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
    clean: true,
    // Générer des fichiers de déclaration TypeScript (.d.ts)
    dts: true,
    // This ensures each module file is treated as an entry point
    splitting: false, // true generate chunk file
    name: 'RiotModule',
    // Formats de sortie : CommonJS et ESM
    format: ['cjs', 'esm'],
    target: 'node22', // 'node18',
    cjsInterop: true,
    noExternal: [],
});