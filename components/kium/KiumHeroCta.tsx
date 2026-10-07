'use client';

import { KIUM_OPEN_HREF, gotoOpenCourses } from '@/lib/kium/gotoOpen';

/**
 * [F43 · 261007] /kium 히어로 CTA: HRD사업팀 요청(지예정 대리).
 *
 * 1차(채움) [공개교육 신청하기] → 같은 페이지에서 과정안내 탭 + 공개교육 보기로 전환 후 탭바 위치로 이동.
 *   회차 카드의 기존 회차별 상담 프리필 흐름으로 이어진다(문의 유형을 새로 만들지 않는다).
 *   href는 무JS 폴백 · 새 탭 열기용 딥링크다.
 * 2차(외곽선) [문의하기] → 상담 폼(#inq).
 * 순서: 1차가 왼쪽(모바일은 위). 구 라벨 '신청 문의' · '지원대상 확인'은 이 위치에서 폐기.
 */
export default function KiumHeroCta() {
  return (
    <div className="kium-hero-cta r">
      <a
        className="btn btn-ink"
        href={KIUM_OPEN_HREF}
        data-ga-id="kium_hero_open"
        onClick={(e) => {
          // 수정키 클릭(새 탭 등)은 브라우저 기본 동작에 맡긴다
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          gotoOpenCourses();
        }}
      >
        공개교육 신청하기
      </a>
      <a className="kium-btn-ghost" href="#inq" data-ga-id="kium_hero_inquiry">
        문의하기
      </a>
    </div>
  );
}
