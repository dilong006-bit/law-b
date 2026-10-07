import { test, expect, type Page } from '@playwright/test';
import { jumpTo } from './helpers';

/**
 * 26827 HRD사업팀 검토 반영 (upgrade-04, TECHSPEC §11-2 1~11).
 * 실제 문의 전송 금지: 폼은 검증 차단 경로만 쓰고, GET 외 요청은 전부 가로채 abort 한 뒤 0건인지 확인한다.
 */

const HUB = '#mandatory';
const FORM = '#mandatory-inquiry';
const SAFETY = '산업안전보건교육';

/** GET 외 요청을 막고 건수를 센다 (전송 경로가 열려도 밖으로 나가지 않게) */
async function blockWrites(page: Page) {
  const sent: string[] = [];
  await page.route('**/*', (route) => {
    const req = route.request();
    if (req.method() === 'GET') return route.continue();
    sent.push(`${req.method()} ${req.url()}`);
    return route.abort();
  });
  return sent;
}

async function openContent(page: Page) {
  await page.goto('/content', { waitUntil: 'networkidle' });
  // 하이드레이션 뒤 조작 (R2 goConsult 테스트와 같은 기준: 허브 버튼이 클라이언트 핸들러를 가진 뒤)
  await expect(page.locator(`${FORM} #f-company`)).toBeVisible();
}

const courseBox = (page: Page, label: string) =>
  page.locator(`${FORM} .lg-course-field label`).filter({ hasText: label }).locator('input[type=checkbox]');

test.describe('법정 허브 구조·문구 (커밋 16)', () => {
  test('1 진단·법정 기준 블록 없음, 차별점 블록 있음', async ({ page }) => {
    await openContent(page);
    await expect(page.locator('#mandatory-diagnose')).toHaveCount(0);
    await expect(page.locator('#mandatory-law')).toHaveCount(0);
    await expect(page.locator('#mandatory-diff')).toHaveCount(1);
  });

  test('2 바로가기 2개, 지표 스트립 없음', async ({ page }) => {
    await openContent(page);
    await expect(page.locator('.lg-quick-a')).toHaveCount(2);
    await expect(page.locator('.lg-quick-a')).toHaveText([/과정 보기/, /빠른 상담/]);
    await expect(page.locator('.lg-stats')).toHaveCount(0);
  });

  test('3 대표 과정 제목, 필터·한 번에 담기 없음, 카드 7', async ({ page }) => {
    await openContent(page);
    await expect(page.locator('#mandatory-courses .lg-bh-title')).toHaveText('2026 법정필수교육 대표 과정');
    await expect(page.locator('.lg-tools, .lg-filter-in, .lg-addmand')).toHaveCount(0);
    await expect(page.locator(HUB)).not.toContainText('법정 의무 과정 한 번에 담기');
    await expect(page.locator('#mandatory-courses .lg-card')).toHaveCount(7);
  });

  test('4 차별점 카드 2, 계약 조건 문구 없음', async ({ page }) => {
    await openContent(page);
    await expect(page.locator('#mandatory-diff .lg-bh-kicker')).toHaveText('차별점');
    await expect(page.locator('#mandatory-diff .lg-diffcard')).toHaveCount(2);
    for (const s of ['월 1회', '정·부 2명', '전담 운영 지원']) await expect(page.locator(HUB)).not.toContainText(s);
  });

  test('5 4단계 라벨·설명 확정 원고 일치', async ({ page }) => {
    await openContent(page);
    // upgrade-05 LB58: 머리말 문구 변경
    await expect(page.locator('#mandatory-process .lg-bh-kicker')).toHaveText('교육 프로세스');
    await expect(page.locator('#mandatory-process .lg-bh-title')).toHaveText('신청부터 수료까지 손쉽게!');
    await expect(page.locator('#mandatory-process .lg-step-label')).toHaveText(['과정 선택 및 신청', '맞춤 구성 확정', '교육 운영 및 독려', '손쉬운 수료 완료']);
    await expect(page.locator('#mandatory-process .lg-step-desc')).toHaveText([
      '우리 회사에 꼭 필요한 법정교육 과정을 골라 간편하게 신청합니다.',
      '우리 회사에 꼭 맞는 필수 과정이 맞는지 꼼꼼히 점검하고 일정·인원을 확정합니다.',
      '전담 운영자가 학습 독려부터 진행 상황까지 밀착 관리합니다.',
      '번거로운 후속 절차 없이 간편하게 수료증까지 발급받습니다.',
    ]);
  });

  test('6 소개서 카드 메타 줄 없음', async ({ page }) => {
    await openContent(page);
    await expect(page.locator('.lg-brochure')).toHaveCount(1);
    await expect(page.locator('.lg-brochure')).not.toContainText('PDF ·');
    await expect(page.locator('.lg-brochure-meta')).toHaveCount(0);
  });

  test('11 홈 히어로 법정 슬라이드: 과정 수 없음', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.textContent ?? '');
    expect(text).toContain('2026년 최신 대표 과정.');
    expect(text).toContain('대표 과정 · 매년 자체 제작 · 전담 운영자 배정');
    expect(text).not.toContain('7개');
  });
});

test.describe('법정 문의 폼 (커밋 17)', () => {
  test('7 직급/직책 대신 예상 교육인원 필수: 미선택 제출 시 차단·오류·포커스', async ({ page }) => {
    const sent = await blockWrites(page);
    await openContent(page);
    const f = page.locator(FORM);
    await expect(f.locator('#f-position')).toHaveCount(0);
    await expect(f.locator('label[for=f-trainees]')).toContainText('예상 교육인원');
    await expect(f.locator('label[for=f-trainees] .req')).toHaveCount(1);
    const opts = await f.locator('#f-trainees option').allTextContents();
    expect(opts).toContain('~ 300명');
    expect(opts).not.toContain('해당없음');
    expect(opts.indexOf('~ 300명')).toBe(opts.indexOf('~ 100명') + 1);
    await expect(f.locator('#f-trainees')).toHaveCount(1); // 회사 규모 줄에 중복 렌더 없음

    await f.locator('#f-company').fill('검수 회사');
    await f.locator('#f-name').fill('검수 담당');
    await f.locator('#f-phone').fill('01012345678');
    await f.locator('#f-email').fill('qa');
    await f.locator('select[name=emailDomain]').selectOption({ index: 1 });
    await courseBox(page, '성희롱 예방 교육').check();
    await f.locator('input[name=agreePrivacy]').check();
    await f.locator('button.submit').click();

    await expect(f.locator('#f-trainees')).toBeFocused();
    await expect(f.locator('#f-trainees')).toHaveAttribute('aria-invalid', 'true');
    await expect(f.locator('.field.invalid #f-trainees')).toHaveCount(1);
    await expect(f.locator('#form-body')).toBeVisible(); // 결과 화면으로 넘어가지 않음

    // 선택하면 제출 전이라도 오류가 바로 풀린다
    await f.locator('#f-trainees').selectOption('lte300');
    await expect(f.locator('#f-trainees')).toHaveAttribute('aria-invalid', 'false');
    await expect(f.locator('.field.invalid #f-trainees')).toHaveCount(0);
    expect(sent, '전송 0').toEqual([]);
  });

  test('8 법정 폼 동의문: 예상 교육인원 필수, 직급/직책 없음', async ({ page }) => {
    await openContent(page);
    const f = page.locator(FORM);
    await jumpTo(page, FORM, 0.1);
    await f.locator('.consent-view').first().click();
    const priv = f.locator('.consent-text').first();
    await expect(priv).toContainText('(필수) 담당자명, 회사·기관명, 연락처, 이메일, 예상 교육인원');
    await expect(priv).toContainText('(선택) 회사 규모(임직원 수), 관심 영역, 문의 내용, 첨부파일');
    await expect(priv).not.toContainText('직급/직책');
  });

  test('9 산업안전보건교육: 체크 후 과정 담기·빼기에도 체크 유지', async ({ page }) => {
    const sent = await blockWrites(page);
    await openContent(page);
    const box = courseBox(page, SAFETY);
    await expect(box).toHaveCount(1);
    await box.check();
    await expect(box, '체크 직후 유지').toBeChecked();

    const pickBtn = page.locator('#mandatory-courses .lg-pick').first();
    await pickBtn.click();
    await expect(pickBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(box, '과정 담은 뒤 유지').toBeChecked();
    await pickBtn.click();
    await expect(pickBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(box, '과정 뺀 뒤 유지').toBeChecked();

    // 요약 패널의 '빼기' 경로
    await pickBtn.click();
    await expect(pickBtn).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.lg-consult-rm').first().click();
    await expect(pickBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(box, '요약 패널에서 뺀 뒤 유지').toBeChecked();

    // 과정 카드·선택 바·요약 패널에는 노출되지 않는다
    await expect(page.locator('#mandatory-courses')).not.toContainText(SAFETY);
    await expect(page.locator('.lg-consult-panel')).not.toContainText(SAFETY);
    expect(sent).toEqual([]);
  });

  test('9-1 희망과정 배치: 법정 8개 2열 × 4행, 기타 전폭', async ({ page }) => {
    await openContent(page);
    const r = await page.evaluate(() => {
      const labels = [...document.querySelectorAll<HTMLElement>('#mandatory-inquiry .lg-course-field > label')];
      const rect = labels.map((l) => l.getBoundingClientRect());
      const grid = document.querySelector('#mandatory-inquiry .lg-course-field')!.getBoundingClientRect();
      return { n: labels.length, lefts: [...new Set(rect.slice(0, 8).map((x) => Math.round(x.left)))].length, tops: [...new Set(rect.slice(0, 8).map((x) => Math.round(x.top)))].length, etcW: Math.round(rect[8].width), gridW: Math.round(grid.width) };
    });
    expect(r.n).toBe(9);
    expect(r.lefts).toBe(2);
    expect(r.tops).toBe(4);
    expect(Math.abs(r.etcW - r.gridW)).toBeLessThanOrEqual(1);
  });

  test('10 홈 폼 회귀: 직급/직책 필수 유지, 예상 교육인원 선택지 ~ 300명', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const f = page.locator('#inq');
    await expect(f.locator('#f-position')).toHaveCount(1);
    await expect(f.locator('label[for=f-position] .req')).toHaveCount(1);
    await expect(f.locator('label[for=f-trainees] .req')).toHaveCount(0);
    const opts = await f.locator('#f-trainees option').allTextContents();
    expect(opts).toEqual(['선택', '해당없음', '1~9명', '~ 50명', '~ 100명', '~ 300명', '~ 500명', '~ 1000명', '~ 1000명 이상']);
    const priv = await f.locator('.consent-text').first().textContent();
    expect(priv).toContain('(필수) 담당자명, 회사·기관명, 직급/직책, 연락처, 이메일(선택) 회사 규모(임직원 수), 예상 교육인원, 관심 영역, 문의 내용, 첨부파일');
  });
});
