import { defineConfig } from '@playwright/test';

/**
 * 프로덕션 스모크 (https://law-b.vercel.app). 서버를 띄우지 않고 배포본을 그대로 확인한다.
 * 사용: npx playwright test -c playwright.prod.config.ts  (BASE_URL 로 다른 배포본 지정 가능)
 * 폼 제출 등 쓰기 동작은 하지 않는다.
 */
export default defineConfig({
  testDir: './tests-prod',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list']],
  timeout: 120_000,
  use: { baseURL: process.env.BASE_URL ?? 'https://law-b.vercel.app' },
});
