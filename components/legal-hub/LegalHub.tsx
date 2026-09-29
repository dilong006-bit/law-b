'use client';

import { PickProvider, usePick } from '@/lib/legal/pick';
import { HUB_COPY } from '@/data/legalHub';
import HubHead from './HubHead';
import Diagnose from './Diagnose';
import CourseLineup from './CourseLineup';
import PickTray from './PickTray';
import StandardAndDiff from './StandardAndDiff';
import Process from './Process';
import CardNewsStory from './CardNewsStory';
import HubFaq from './HubFaq';
import HubInquiry from './HubInquiry';

/** 선택 개수 변화 안내 — 시각적 숨김 aria-live (legal-B §4) */
function PickAnnouncer() {
  const { picked } = usePick();
  return <p className="lg-sr" aria-live="polite">{picked.length > 0 ? HUB_COPY.tray.count(picked.length) : ''}</p>;
}

/**
 * /content#mandatory 법정 허브 (legal-B §6-2). 기존 #ax5 섹션 자리를 대체한다.
 * 블록 순서(upgrade-03 §3): 헤더·빠른 실행 → 진단 → 과정 7 + 맞춤 타일 → 법정 기준·차이 → 도입 절차
 * → 자료(카드뉴스 스토리·소개서) → (FAQ 비표시) → 빠른 상담. 선택 바(LB13)는 공통.
 */
export default function LegalHub() {
  return (
    <section className="section lg-hub" id="mandatory" aria-labelledby="mandatory-title">
      {/* 기존 #ax5 딥링크 호환 — 섹션 상단에 두어 예전 #ax5 섹션과 같은 위치에 착지한다 */}
      <span id="ax5" className="lg-ax5" aria-hidden="true" />
      <PickProvider>
        <div className="wrap">
          <HubHead />
          <Diagnose />
          <CourseLineup />
          <StandardAndDiff />
          <Process />
          <CardNewsStory />
          {/* LB12 실무 FAQ — 답변 확정 전 블록 전체 비표시 (질문만 노출 금지) */}
          {HUB_COPY.faq.show && <HubFaq />}
        </div>
        <HubInquiry />
        <PickAnnouncer />
        <PickTray />
      </PickProvider>
    </section>
  );
}
