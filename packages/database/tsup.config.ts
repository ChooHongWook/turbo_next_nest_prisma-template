import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // DTS 생성 비활성화
  sourcemap: true,
  clean: true,
});