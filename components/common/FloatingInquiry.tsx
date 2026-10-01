'use client';

import dynamic from 'next/dynamic';

/** 기능 플래그: NEXT_PUBLIC_FI_ENABLED='0' 이면 렌더하지 않는다 (기본 활성). 빌드 시 인라인 */
const FI_ENABLED = process.env.NEXT_PUBLIC_FI_ENABLED !== '0';

/**
 * 플로팅 문의 바 마운트 지점 (layout 에서 footer 뒤 1회).
 * 바는 서버·첫 렌더에서 항상 숨김이라 본체(FloatingInquiryBar)를 하이드레이션 뒤 비동기로 불러온다.
 * 아이콘 레지스트리·관찰 훅이 전 페이지 첫 로드 JS 에 들어가지 않게 하려는 것 (추가 JS 3KB gzip 목표)
 */
const Bar = dynamic(() => import('./FloatingInquiryBar'), { ssr: false });

export default function FloatingInquiry() {
  return FI_ENABLED ? <Bar /> : null;
}
