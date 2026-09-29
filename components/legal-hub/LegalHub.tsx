'use client';

import { PickProvider, usePick } from '@/lib/legal/pick';
import { HUB_COPY } from '@/data/legalHub';
import HubHead from './HubHead';
import Diagnose from './Diagnose';
import CourseLineup from './CourseLineup';
import PickTray from './PickTray';
import LawTable from './LawTable';
import OpsSupport from './OpsSupport';
import Difference from './Difference';
import Resources from './Resources';
import HubFaq from './HubFaq';

/** 선택 개수 변화 안내 — 시각적 숨김 aria-live (legal-B §4) */
function PickAnnouncer() {
  const { picked } = usePick();
  return <p className="lg-sr" aria-live="polite">{picked.length > 0 ? HUB_COPY.tray.count(picked.length) : ''}</p>;
}

/**
 * /content#mandatory 법정 허브 (legal-B §6-2). 기존 #ax5 섹션 자리를 대체한다.
 * 블록 순서(§6-2): 헤더·탭(LB4) → 진단(LB5) → 라인업·상세(LB6·7) → 법정 기준(LB8) → 운영 지원(LB9)
 * → 차별점(LB10) → 자료(LB11) → (FAQ 비표시, LB12) → 문의(LB14, 단계 8). 선택 바(LB13)는 공통.
 */
export default function LegalHub({ icon }: { icon: () => JSX.Element }) {
  return (
    <section className="section lg-hub" id="mandatory" aria-labelledby="mandatory-title">
      {/* 기존 #ax5 딥링크 호환 — 섹션 상단에 두어 예전 #ax5 섹션과 같은 위치에 착지한다 */}
      <span id="ax5" className="lg-ax5" aria-hidden="true" />
      <PickProvider>
        <div className="wrap">
          <HubHead icon={icon} />
          <Diagnose />
          <CourseLineup />
          <LawTable />
          <OpsSupport />
          <Difference />
          <Resources />
          {/* LB12 실무 FAQ — 답변 확정 전 블록 전체 비표시 (질문만 노출 금지) */}
          {HUB_COPY.faq.show && <HubFaq />}
        </div>
        {/* LB14 법정 문의 — 단계 8 */}
        <div className="lg-anchor" id="mandatory-inquiry" />
        <PickAnnouncer />
        <PickTray />
      </PickProvider>
    </section>
  );
}
