/**
 * 필요 과정 진단 규칙 (legal-B upgrade-01 §2-3, PRD LB22 — LB5 변경).
 * 순수 함수 — React·DOM 의존 없음. 규칙은 법무 검수 전 '참고용'이다.
 * 부분 응답을 허용한다: 답하지 않은 상태에서도 공통 추천(법정 의무 2 + 권고 2)을 돌려주고,
 * 문항에 답할 때마다 그 답까지 반영한다. complete 는 3문항을 모두 답했는지.
 * 3문항을 모두 답한 27조합의 결과는 기존(v1.0) 함수와 같다.
 */
import { LEGAL_COURSES, type LegalCourseId } from '@/data/legal';

export type DiagAnswer = { size?: 'lt10'|'10to49'|'gte50'; pension?: 'yes'|'no'|'unknown'; industry?: 'finance'|'public'|'general' };
export type DiagResult = {
  mandatory: LegalCourseId[]; recommended: LegalCourseId[]; industry: LegalCourseId[];
  smallNote: boolean; complete: boolean;
};

const ORDER = new Map(LEGAL_COURSES.map((c) => [c.id, c.order]));
/** 그룹 안 순서는 과정 라인업 순서(LEGAL_COURSES.order)를 따른다 */
const byOrder = (ids: LegalCourseId[]) => [...ids].sort((a, b) => (ORDER.get(a) ?? 0) - (ORDER.get(b) ?? 0));

export function diagnose(a: DiagAnswer): DiagResult {
  const mandatory: LegalCourseId[] = ['sexual', 'disability'];
  if (a.pension === 'yes' || a.pension === 'unknown') mandatory.push('pension');
  const recommended: LegalCourseId[] = ['harassment', 'privacy'];
  const industry: LegalCourseId[] = a.industry === 'finance' ? ['aml'] : a.industry ? ['ethics'] : [];
  return {
    mandatory: byOrder(mandatory), recommended: byOrder(recommended), industry: byOrder(industry),
    smallNote: a.size === 'lt10',
    complete: Boolean(a.size && a.pension && a.industry),
  };
}
