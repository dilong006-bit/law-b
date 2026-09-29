'use client';

import { useEffect, useMemo } from 'react';
import HomeInquiry from '@/components/sections/home/HomeInquiry';
import { LEGAL_COPY, LEGAL_COURSE_OPTIONS, LEGAL_ETC_MAX } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import type { CourseFieldConfig } from '@/lib/legal/courseField';
import { CONSULT_HASH, CONSULT_ID, consultFirstField } from '@/lib/legal/goConsult';
import { optionsOf, usePick } from '@/lib/legal/pick';
import BlockHead from './BlockHead';
import ConsultSummary from './ConsultSummary';

/** 희망과정 필드 설정 — law-A 이식본과 같은 값(모듈 상수라 참조가 고정된다) */
const COURSE_FIELD: CourseFieldConfig = {
  label: LEGAL_COPY.inquiry.fieldLabel,
  options: LEGAL_COURSE_OPTIONS,
  etcLabel: LEGAL_COPY.inquiry.etcLabel,
  etcPlaceholder: LEGAL_COPY.inquiry.etcPlaceholder,
  etcMax: LEGAL_ETC_MAX,
  errRequired: LEGAL_COPY.inquiry.errRequired,
  errEtc: LEGAL_COPY.inquiry.errEtc,
};
const PRESET = ['compliance'];
/** 짧은 폼 비표시 필드 (upgrade-01 §6-7) — payload 키는 기본값으로 유지 */
const HIDDEN = ['companySize', 'trainees', 'attachment'] as const;
const I = HUB_COPY.inquiry;

/**
 * 빠른 상담 (legal-B upgrade-01 LB27 + upgrade-02 LB34). 5+7: 좌 요약 패널(sticky) / 우 짧은 폼(높이 결정자).
 * 공유 폼(HomeInquiry)은 선택 prop 으로만 조정한다 — payload 구조 불변, lead_source content-legal.
 * 선택 상태(picked) ↔ 희망과정 체크가 양방향으로 이어지고, 소개서 게이트 입력값은 비어 있는 칸에만 채워진다.
 */
export default function HubInquiry() {
  const pick = usePick();
  const courseValue = useMemo(() => optionsOf(pick.picked), [pick.picked]);

  // 해시 진입(홈 히어로 '빠른 상담'): 레이아웃이 자리 잡은 뒤(rAF 2회) 첫 칸 포커스. 스크롤은 브라우저 앵커 이동에 맡긴다
  useEffect(() => {
    if (location.hash !== CONSULT_HASH) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => consultFirstField()?.focus({ preventScroll: true })); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  return (
    <div className="lg-block lg-anchor lg-inq" id={CONSULT_ID}>
      <BlockHead kicker={I.kicker} title={I.panelTitle.join(' ')} titleSr />
      <div className="lg-row lg-consult" data-balance-row data-pair="summary-action" data-sticky-summary>
        <ConsultSummary />
        <div className="lg-c7 lg-consult-form" data-height-owner>
          <HomeInquiry
            presetInterests={PRESET}
            leadSource="content-legal"
            courseField={COURSE_FIELD}
            hiddenFields={HIDDEN}
            messageRows={2}
            submitGaId="legal_quick_submit"
            prefill={pick.prefill}
            courseValue={courseValue}
            onCourseChange={pick.setFromOptions}
          />
        </div>
      </div>
    </div>
  );
}
