import { describe, expect, it } from 'vitest';
import { FLOATING_INQUIRY, FI_ACCENTS, FI_CTA_MAX, FI_SHORT_MAX, validateFiData, type FiPage } from '@/data/floatingInquiry';
import { INQ } from '@/data/home';
import { computeVisible, findPage, pickCopy, resolveHref, zoneName, type FiSignals } from '@/lib/fi/state';

const ON: FiSignals = {
  configured: true, dismissed: false, reached: true,
  hideTargetSeen: false, footerSeen: false, blocked: false,
  mobile: false, inputFocused: false, shortViewport: false,
};

describe('computeVisible', () => {
  it('모든 조건 충족 시 노출', () => expect(computeVisible(ON)).toBe(true));

  // 신호 하나씩 뒤집기
  const flips: [string, Partial<FiSignals>, boolean][] = [
    ['설정 없는 경로', { configured: false }, false],
    ['닫기 후', { dismissed: true }, false],
    ['기준 섹션 미도달', { reached: false }, false],
    ['문의 섹션 20% 이상', { hideTargetSeen: true }, false],
    ['푸터 보임', { footerSeen: true }, false],
    ['모달·메뉴·lg-tray·티저', { blocked: true }, false],
    ['짧은 화면 (높이 480 미만)', { shortViewport: true }, false],
    ['휴대폰 입력 중', { mobile: true, inputFocused: true }, false],
    ['휴대폰, 입력 아님', { mobile: true }, true],
    ['PC 입력 중 (휴대폰만 숨김)', { inputFocused: true }, true],
    ['휴대폰 입력 중 + 미도달', { mobile: true, inputFocused: true, reached: false }, false],
    ['닫기 + 차단', { dismissed: true, blocked: true }, false],
    // N1: 바 안에 포커스가 있으면 숨김 조건(도달·문의·푸터·입력·짧은 화면)을 보류, 닫기·차단·미설정은 그대로
    ['포커스 안: 푸터 보임', { focusInside: true, footerSeen: true }, true],
    ['포커스 안: 미도달·문의 섹션', { focusInside: true, reached: false, hideTargetSeen: true }, true],
    ['포커스 안: 모달 차단', { focusInside: true, blocked: true }, false],
    ['포커스 안: 닫기', { focusInside: true, dismissed: true }, false],
    ['포커스 안: 미설정 경로', { focusInside: true, configured: false }, false],
  ];
  it.each(flips)('%s', (_name, patch, want) => {
    expect(computeVisible({ ...ON, ...patch })).toBe(want);
  });
});

describe('pickCopy / zoneName', () => {
  const content = FLOATING_INQUIRY.find((p) => p.path === '/content') as FiPage;
  it('기본 구간', () => {
    expect(pickCopy(content, null)).toBe(content.copy);
    expect(zoneName(null)).toBe('default');
  });
  it('법정 구간 진입: 법정 문구·compliance', () => {
    const c = pickCopy(content, '#mandatory');
    expect(c.short).toBe('법정교육 상담');
    expect(c.interest).toBe('compliance');
    expect(zoneName('#mandatory')).toBe('mandatory');
  });
  it('법정 구간 이탈: 기본 문구 복귀', () => expect(pickCopy(content, null).interest).toBe('content'));
  it('설정에 없는 구간은 기본 문구', () => expect(pickCopy(content, '#nope')).toBe(content.copy));
  it('zones 없는 페이지는 항상 기본', () => {
    const home = FLOATING_INQUIRY[0];
    expect(pickCopy(home, '#mandatory')).toBe(home.copy);
  });
});

describe('resolveHref / findPage', () => {
  it('같은 페이지는 #inq (/content 는 상담 블록 #mandatory-inquiry), AX·AI 는 홈 폼 URL', () => {
    const want: Record<string, string> = { '/': '#inq', '/ax-ai': '/?interest=ax-ai#inq', '/leadership': '#inq', '/hrd': '#inq', '/content': '#mandatory-inquiry' };
    for (const p of FLOATING_INQUIRY) {
      expect(resolveHref(p, p.copy)).toBe(want[p.path]);
      for (const z of p.zones ?? []) expect(resolveHref(p, z.copy)).toBe(want[p.path]);
    }
  });
  it('경로 매칭 (끝 슬래시 무시, 미설정 경로 null)', () => {
    expect(findPage(FLOATING_INQUIRY, '/hrd/')?.path).toBe('/hrd');
    expect(findPage(FLOATING_INQUIRY, '/')?.path).toBe('/');
    for (const p of ['/kium', '/privacy', '/csr', '/nope', null]) expect(findPage(FLOATING_INQUIRY, p)).toBeNull();
  });
});

describe('데이터 검증', () => {
  it('5개 경로', () => {
    expect(FLOATING_INQUIRY.map((p) => p.path).sort()).toEqual(['/', '/ax-ai', '/content', '/hrd', '/leadership']);
  });
  it('글자 수·accent·interest 키 (문의 폼 관심 영역과 일치)', () => {
    expect(validateFiData(FLOATING_INQUIRY, INQ.interests.map((o) => o.value))).toEqual([]);
  });
  it('제한 초과는 검출', () => {
    const bad: FiPage[] = [{ ...FLOATING_INQUIRY[0], copy: { ...FLOATING_INQUIRY[0].copy, short: '열한글자짜리짧은문구다', cta: '아홉글자짜리버튼문구', accent: 'p9' as never } }];
    expect(validateFiData(bad)).toHaveLength(3);
  });
  it('제한값', () => {
    expect([FI_SHORT_MAX, FI_CTA_MAX]).toEqual([10, 8]);
    expect(FI_ACCENTS).toEqual(['p1', 'p2', 'p3', 'p4']);
  });
});
