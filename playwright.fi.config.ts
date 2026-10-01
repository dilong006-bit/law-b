import { defineConfig } from '@playwright/test';

/**
 * 플로팅 문의 바·카드뉴스 E2E 전용 설정 (tests-fi/). 기존 playwright.config.ts(testDir ./tests, next dev) 는 그대로 둔다.
 * 이 경로에서는 next dev 가 .next 파일 잠금 오류를 내므로 프로덕션 빌드(next build + next start)로 돌린다.
 * 사용: npm run test:e2e:fi  (PW_PORT 기본 3002, 이미 떠 있는 서버는 재사용)
 */
const PORT = Number(process.env.PW_PORT ?? 3002);

export default defineConfig({
  testDir: './tests-fi',
  fullyParallel: true,
  // 이 PC(Windows, 보안 프로그램 파일 검사)에서 4개 병렬은 CPU 경합으로 위치·타이밍 판정이 흔들려 2개로 둔다
  workers: 2,
  retries: 0,
  reporter: [['list']],
  timeout: 120_000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 600_000,
  },
});
