'use client';

import { useMemo } from 'react';
import HomeInquiry from '@/components/sections/home/HomeInquiry';
import { LEGAL_COPY, LEGAL_COURSE_OPTIONS, LEGAL_ETC_MAX } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import type { CourseFieldConfig } from '@/lib/legal/courseField';
import { optionsOf, usePick } from '@/lib/legal/pick';

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
const PANEL = { title: HUB_COPY.inquiry.panelTitle, body: HUB_COPY.inquiry.panelBody };
const FOLD = { label: HUB_COPY.inquiry.foldLabel, fields: ['companySize', 'trainees', 'message', 'attachment'] as const };
const PRESET = ['compliance'];

/**
 * 법정 문의 (legal-B LB14). 공유 폼(HomeInquiry)을 선택 prop 으로만 조정한다 — payload 구조 불변.
 * 선택 상태(picked) ↔ 희망과정 체크가 양방향으로 이어지고, 소개서 게이트 입력값은 비어 있는 칸에만 채워진다.
 */
export default function HubInquiry() {
  const pick = usePick();
  const courseValue = useMemo(() => optionsOf(pick.picked), [pick.picked]);
  return (
    <div className="lg-anchor lg-inq" id="mandatory-inquiry">
      <HomeInquiry
        presetInterests={PRESET}
        leadSource="content-legal"
        courseField={COURSE_FIELD}
        panel={PANEL}
        optionalFold={FOLD}
        prefill={pick.prefill}
        courseValue={courseValue}
        onCourseChange={pick.setFromOptions}
      />
    </div>
  );
}
