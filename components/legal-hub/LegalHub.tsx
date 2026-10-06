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
 * 블록 순서(upgrade-04 §2): 헤더 → 대표 과정 → 차별점 → 도입 절차 → 자료(카드뉴스 스토리·소개서)
 * → (FAQ 비표시) → 빠른 상담(요약 패널 + 짧은 폼). 선택 바(LB28)는 공통.
 * 진단(diagnose.show)·법정 기준(law.show)은 플래그 비표시 (D27, 코드·데이터 보존).
 */
export default function LegalHub() {
  return (
    <section className="section lg-hub" id="mandatory" aria-labelledby="mandatory-title">
      {/* 기존 #ax5 딥링크 호환 — 섹션 상단에 두어 예전 #ax5 섹션과 같은 위치에 착지한다 */}
      <span id="ax5" className="lg-ax5" aria-hidden="true" />
      <PickProvider>
        <div className="wrap">
          <HubHead />
          {/* upgrade-04 LB48 (#63): 진단 블록 비표시. 차년도 보완 후 diagnose.show=true 로 복원 */}
          {HUB_COPY.diagnose.show && <Diagnose />}
          <CourseLineup />
          <StandardAndDiff />
          <Process />
          <CardNewsStory />
          {/* LB12 실무 FAQ — 답변 확정 전 블록 전체 비표시 (질문만 노출 금지) */}
          {HUB_COPY.faq.show && <HubFaq />}
          <HubInquiry />
        </div>
        <PickAnnouncer />
        <PickTray />
      </PickProvider>
    </section>
  );
}
