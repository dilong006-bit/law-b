'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LEGAL_COURSES, type LegalCourse, type LegalCourseId, type LegalKind } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { usePick } from '@/lib/legal/pick';
import { useModal } from '@/lib/useModal';
import CourseCard from './CourseCard';
import CourseDetail from './CourseDetail';
import { IcClose } from './icons';
import { useEdgeFade } from './useEdgeFade';

const L = HUB_COPY.lineup;
type Filter = 'all' | LegalKind;

/** 760 이하 = 바텀시트, 그 위는 행 아래 인라인 상세. 열 수는 그리드 CSS 와 같은 기준(1040/880/560) */
const SHEET_MQ = '(max-width:760px)';
const COL_MQ: [string, number][] = [['(max-width:560px)', 1], ['(max-width:880px)', 2], ['(max-width:1040px)', 3]];
/** 인라인 상세 열림 전환(.lg-dslot) 시간 — CSS 와 같은 값 */
const SLOT_MS = 280;
/** 상세를 끌어올릴 때 고정 헤더(nav+SubNav) 아래 여백 */
const REVEAL_GAP = 16;

const MANDATORY_IDS: LegalCourseId[] = LEGAL_COURSES.filter((c) => c.kind === 'mandatory').map((c) => c.id);

/**
 * 과정 라인업 + 상세 (legal-B LB6·LB7).
 * 상세는 /kium 과정 그리드 방식: 열린 카드가 속한 행 뒤에 전체 폭 행을 끼우고(761 이상),
 * 760 이하에서는 body 로 포털한 바텀시트(useModal: 포커스 트랩·ESC·스크롤 잠금·포커스 복귀)로 연다.
 */
export default function CourseLineup() {
  const pick = usePick();
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<LegalCourseId | null>(null);
  const [cols, setCols] = useState(4);
  const [sheet, setSheet] = useState(false);
  const [slotOpen, setSlotOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const filterRef = useEdgeFade<HTMLDivElement>();
  const skipScroll = useRef(false);

  const visible = filter === 'all' ? LEGAL_COURSES : LEGAL_COURSES.filter((c) => c.kind === filter);
  const openCourse = visible.find((c) => c.id === openId) ?? null;
  const openIndex = openCourse ? visible.indexOf(openCourse) : -1;
  const prev = openIndex > 0 ? visible[openIndex - 1] : null;
  const next = openIndex >= 0 && openIndex < visible.length - 1 ? visible[openIndex + 1] : null;

  useEffect(() => setMounted(true), []);

  // 열 수·시트 분기 (matchMedia 로 동작만 분기, 마크업은 하나)
  useEffect(() => {
    const sheetMq = window.matchMedia(SHEET_MQ);
    const mqs = COL_MQ.map(([q]) => window.matchMedia(q));
    const sync = () => {
      setSheet(sheetMq.matches);
      const hit = COL_MQ.find((_, i) => mqs[i].matches);
      setCols(hit ? hit[1] : 4);
    };
    sync();
    [sheetMq, ...mqs].forEach((m) => m.addEventListener('change', sync));
    return () => [sheetMq, ...mqs].forEach((m) => m.removeEventListener('change', sync));
  }, []);

  // 인라인 상세: 닫힌 채 마운트 → 다음 프레임에 열어 높이 전환을 태우고, 전환 뒤 상세 상단을 헤더 아래로 끌어온다
  useEffect(() => {
    if (!openId || sheet) { setSlotOpen(false); return; }
    const raf = requestAnimationFrame(() => setSlotOpen(true));
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      if (skipScroll.current) { skipScroll.current = false; return; }
      const el = document.getElementById(`lg-detail-${openId}`);
      if (!el) return;
      const chrome = document.querySelector('.subnav')?.getBoundingClientRect().bottom ?? 72;
      const { top } = el.getBoundingClientRect();
      if (top >= chrome + REVEAL_GAP && top <= window.innerHeight * 0.5) return; // 이미 잘 보이면 흔들지 않는다
      window.scrollBy({ top: top - chrome - REVEAL_GAP, behavior: rm ? 'auto' : 'smooth' });
    }, rm ? 0 : SLOT_MS);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [openId, sheet]);

  const toggle = (id: LegalCourseId) => setOpenId((cur) => (cur === id ? null : id));
  const closeDetail = useCallback(() => setOpenId(null), []);
  /** 인라인 닫기 버튼 — 닫은 뒤 포커스를 해당 카드 제목으로 돌려준다 */
  const closeInline = () => {
    const id = openId;
    setOpenId(null);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[aria-controls="lg-detail-${id}"].lg-card-title`)?.focus());
  };
  const changeFilter = (f: Filter) => { setFilter(f); setOpenId(null); };

  const sheetRef = useModal(sheet && !!openCourse, closeDetail);
  const dragY = useRef<number | null>(null);

  // 행 뒤 삽입 위치: 열린 카드가 속한 행의 마지막 카드 인덱스
  const insertAfter = openIndex < 0 ? -1 : Math.min(Math.floor(openIndex / cols) * cols + cols - 1, visible.length - 1);
  const detailId = (id: string) => `lg-detail-${id}`;
  const titleId = (id: string) => `lg-detail-title-${id}`;

  return (
    <div className="lg-block lg-anchor" id="mandatory-courses">
      <h3 className="substep">{L.title}</h3>
      <div className="lg-tools">
        <div className="subnav-in lg-filter-in" ref={filterRef} data-fade="none" role="radiogroup" aria-label={L.title}>
          {L.filters.map(([v, label]) => (
            <label className="lg-chip" key={v}>
              <input className="lg-sr" type="radio" name="lg-lineup-filter" value={v} checked={filter === v} onChange={() => changeFilter(v as Filter)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <button type="button" className="btn btn-line-dark lg-addmand" onClick={() => pick.addMany(MANDATORY_IDS)}>{L.addMandatory}</button>
      </div>
      <p className="lg-note">{L.previewNote}</p>

      <div className="lg-grid">
        {visible.map((c, i) => (
          <Fragment key={c.id}>
            <CourseCard course={c} open={openCourse?.id === c.id} detailId={detailId(c.id)} onToggle={() => toggle(c.id)} />
            {!sheet && i === insertAfter && openCourse && (
              <div className={`lg-dslot${slotOpen ? ' open' : ''}`} id={detailId(openCourse.id)} role="region" aria-label={`${openCourse.short} 상세`}>
                <div className="lg-dclip">
                  <CourseDetail
                    course={openCourse}
                    titleId={titleId(openCourse.id)}
                    prev={prev}
                    next={next}
                    onGo={(t: LegalCourse) => setOpenId(t.id)}
                    onClose={closeInline}
                  />
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* 760 이하 바텀시트 — body 로 포털(조상 transform 과 무관하게 뷰포트 기준 고정) */}
      {mounted && sheet && createPortal(
        <>
          <div className={`lg-sheet-dim${openCourse ? ' open' : ''}`} onClick={closeDetail} aria-hidden="true" />
          <div
            className={`lg-sheet${openCourse ? ' open' : ''}`}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={openCourse ? titleId(openCourse.id) : undefined}
            aria-hidden={!openCourse}
            id={openCourse ? detailId(openCourse.id) : undefined}
          >
            <div
              className="lg-sheet-handle"
              onTouchStart={(e) => { dragY.current = e.touches[0].clientY; }}
              onTouchEnd={(e) => { if (dragY.current !== null && e.changedTouches[0].clientY - dragY.current > 60) closeDetail(); dragY.current = null; }}
            ><span /></div>
            <button type="button" className="lg-sheet-close" onClick={closeDetail} aria-label={L.close} data-autofocus><IcClose /></button>
            <div className="lg-sheet-body">
              {openCourse && (
                <CourseDetail course={openCourse} titleId={titleId(openCourse.id)} prev={prev} next={next} onGo={(t: LegalCourse) => setOpenId(t.id)} />
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
