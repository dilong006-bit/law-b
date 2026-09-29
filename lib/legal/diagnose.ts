/**
 * 필요 과정 진단 규칙 (기술명세서 legal-B §3-3, PRD LB5).
 * 순수 함수 — React·DOM 의존 없음. 규칙은 법무 검수 전 '참고용'이다.
 * 3문항 중 하나라도 비어 있으면 null (결과 자리에 안내 문구, 담기 비활성).
 */
import { LEGAL_COURSES, type LegalCourseId } from '@/data/legal';

export type DiagAnswer = { size?: 'lt10'|'10to49'|'gte50'; pension?: 'yes'|'no'|'unknown'; industry?: 'finance'|'public'|'general' };
export type DiagResult = { mandatory: LegalCourseId[]; recommended: LegalCourseId[]; industry: LegalCourseId[]; smallNote: boolean } | null;

const ORDER = new Map(LEGAL_COURSES.map((c) => [c.id, c.order]));
/** 그룹 안 순서는 과정 라인업 순서(LEGAL_COURSES.order)를 따른다 */
const byOrder = (ids: LegalCourseId[]) => [...ids].sort((a, b) => (ORDER.get(a) ?? 0) - (ORDER.get(b) ?? 0));

export function diagnose(a: DiagAnswer): DiagResult {
  if (!a.size || !a.pension || !a.industry) return null;
  const mandatory: LegalCourseId[] = ['sexual', 'disability'];
  if (a.pension !== 'no') mandatory.push('pension');
  const recommended: LegalCourseId[] = ['harassment', 'privacy'];
  const industry: LegalCourseId[] = a.industry === 'finance' ? ['aml'] : ['ethics'];
  return { mandatory: byOrder(mandatory), recommended: byOrder(recommended), industry: byOrder(industry), smallNote: a.size === 'lt10' };
}
