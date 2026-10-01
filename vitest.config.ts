import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// 단위 테스트 (플로팅 문의 바 순수 로직·데이터 검증). DOM 이 필요 없어 node 환경.
// tests/ 는 Playwright(testDir ./tests) 영역이라 단위 테스트는 lib 아래 __tests__ 에 둔다.
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    environment: 'node',
    include: ['lib/**/__tests__/**/*.test.ts'],
  },
});
