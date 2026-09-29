'use client';

import { PickProvider, usePick } from '@/lib/legal/pick';
import { HUB_COPY } from '@/data/legalHub';
import HubHead from './HubHead';
import Diagnose from './Diagnose';
import LegacyAx5Body from './LegacyAx5Body';

/** 선택 개수 변화 안내 — 시각적 숨김 aria-live (legal-B §4) */
function PickAnnouncer() {
  const { picked } = usePick();
  return <p className="lg-sr" aria-live="polite">{picked.length > 0 ? HUB_COPY.tray.count(picked.length) : ''}</p>;
}

/**
 * /content#mandatory 법정 허브 (legal-B §6-2). 기존 #ax5 섹션 자리를 대체한다.
 * 단계 5 범위: 헤더·탭(LB4), 진단(LB5). 나머지 블록은 id 만 가진 빈 자리(높이 0)로 두고,
 * 법정 기준 자리에는 기존 ax5 본문을 임시로 렌더한다(LegacyAx5Body, 단계 7 에서 교체).
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
          {/* LB6·LB7 과정 라인업 — 단계 6 */}
          <div className="lg-anchor" id="mandatory-courses" />
          {/* LB8 법정 기준 자리 — 임시로 기존 ax5 본문 (단계 7 에서 LawTable·Difference 로 교체) */}
          <div className="lg-block lg-anchor" id="mandatory-law">
            <LegacyAx5Body />
          </div>
          {/* LB11 자료 — 단계 7 */}
          <div className="lg-anchor" id="mandatory-resources" />
        </div>
        {/* LB14 법정 문의 — 단계 8 */}
        <div className="lg-anchor" id="mandatory-inquiry" />
        <PickAnnouncer />
      </PickProvider>
    </section>
  );
}
