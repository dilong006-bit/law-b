import { courseById, type LegalCourseId } from '@/data/legal';
import { LgIcon } from './icons';

/**
 * 과정 아이덴티티 아이콘 (legal-B upgrade-03 LB40, TECHSPEC §4-1). 한 과정 = 한 아이콘, 값은 LEGAL_COURSES[].icon 한 곳.
 * 사용처 5곳: 진단 칩 16 / 상세 헤더 20 / 법정 표 교육명 18 / 선택 바 목록 16 / 빠른 상담 요약 16. 과정 카드 본문에는 쓰지 않는다(썸네일과 중복).
 * 장식(aria-hidden) — 과정명 글자가 의미를 전달한다.
 */
export function CourseIcon({ id, size = 16 }: { id: LegalCourseId; size?: 16 | 18 | 20 }) {
  const c = courseById(id);
  if (!c) return null;
  return <LgIcon name={c.icon} size={size} className="lg-course-ico" />;
}
