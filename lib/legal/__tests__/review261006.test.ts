import { describe, expect, it } from 'vitest';
import { LEGAL_COURSES, LEGAL_COURSE_OPTIONS, LEGAL_SYNC_OPTIONS } from '@/data/legal';
import { INQ } from '@/data/home';
import { courseToken } from '@/lib/legal/courseField';
import { idsFromOptions } from '@/lib/legal/pick';
import { consentItems } from '@/lib/inquiry/consentItems';

/** 26827 HRD사업팀 검토 반영 (upgrade-04, TECHSPEC §11-1) 순수 로직 */
describe('LB55 희망과정 산업안전보건교육', () => {
  it('과정과 매핑되지 않아 담은 과정으로 바뀌지 않는다', () => {
    expect(idsFromOptions(['산업안전보건교육'])).toEqual([]);
    expect(idsFromOptions(['성희롱 예방 교육', '산업안전보건교육'])).toEqual(['sexual']);
  });

  it('옵션 8개, 법정 과목 마지막. 동기화 대상에서는 빠진다', () => {
    expect(LEGAL_COURSE_OPTIONS).toHaveLength(8);
    expect(LEGAL_COURSE_OPTIONS[7]).toBe('산업안전보건교육');
    expect(LEGAL_SYNC_OPTIONS).not.toContain('산업안전보건교육');
    expect(LEGAL_SYNC_OPTIONS).toEqual(LEGAL_COURSES.map((c) => c.option));
    expect(LEGAL_COURSES).toHaveLength(7); // 과정 카드는 불변
  });

  it('제출 토큰에 그대로 실린다', () => {
    expect(courseToken(['성희롱 예방 교육', '산업안전보건교육'], '')).toBe('[희망과정: 성희롱 예방 교육·산업안전보건교육]');
  });
});

describe('LB54 예상 교육인원 · 동의문', () => {
  it("'~ 300명'(lte300) 이 ~ 100명 다음, 기존 값 불변", () => {
    expect(INQ.trainees.map((o) => o.value)).toEqual(['none', 'lte9', 'lte50', 'lte100', 'lte300', 'lte500', 'lte1000', 'gt1000']);
    expect(INQ.trainees.find((o) => o.value === 'lte300')?.label).toBe('~ 300명');
  });

  it("consentItems('position') = 기준 커밋(ce05d8b) 동의문 문자열", () => {
    expect(consentItems('position')).toEqual({
      req: '담당자명, 회사·기관명, 직급/직책, 연락처, 이메일',
      opt: '회사 규모(임직원 수), 예상 교육인원, 관심 영역, 문의 내용, 첨부파일',
    });
  });

  it("consentItems('trainees') 필수 항목 = 법정 폼 실제 필수 항목", () => {
    const { req, opt } = consentItems('trainees');
    expect(req).toBe('담당자명, 회사·기관명, 연락처, 이메일, 예상 교육인원');
    expect(req).not.toContain('직급/직책');
    expect(opt).not.toContain('예상 교육인원');
  });
});
