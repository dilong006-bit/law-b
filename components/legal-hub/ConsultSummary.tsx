'use client';

import { useEffect, useRef, useState } from 'react';
import { courseById } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { COMMON_PICK } from '@/lib/legal/diagnose';
import type { LgIconName } from '@/lib/legal/iconData';
import { usePick } from '@/lib/legal/pick';
import { CourseIcon } from './CourseIcon';
import { LgIcon } from './icons';
import LgPhoto from './LgPhoto';

const I = HUB_COPY.inquiry;
/** 1041 이상 sticky 상단 여백(141 = nav 72 + SubNav 53 + 16)과 해제 기준 여유(160) — TECHSPEC upgrade-02 §8-2 */
const STICKY_ROOM = 160;

/**
 * 빠른 상담 요약 패널 (legal-B upgrade-02 LB34, TECHSPEC §8).
 * 다크 면(허브 유일) + 장식 사진·오버레이, 안쪽 내용은 1041 이상에서 sticky — 긴 폼을 내리는 동안 담은 과정 요약이 보인다.
 * 담은 과정은 폼 희망과정·카드·선택 바와 같은 선택 상태(usePick). 880 이하는 사진·약속을 숨긴 요약 바.
 */
export default function ConsultSummary() {
  const { picked, remove, addMany } = usePick();
  const inner = useRef<HTMLDivElement | null>(null);
  const [noSticky, setNoSticky] = useState(false);

  // 패널 내용이 화면보다 길면 sticky 해제 (담은 과정 수·폭이 바뀔 때마다 재계산)
  useEffect(() => {
    const el = inner.current; if (!el) return;
    const check = () => setNoSticky(el.offsetHeight > window.innerHeight - STICKY_ROOM);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener('resize', check);
    return () => { ro.disconnect(); window.removeEventListener('resize', check); };
  }, []);

  return (
    <aside className="lg-c5 lg-consult-panel" aria-label={I.kicker}>
      {/* 세로로 긴 패널(약 2:5)에 맞춰 서버 크롭 — 절대 위치라 aspect-ratio 는 적용되지 않는다 */}
      <LgPhoto className="lg-consult-photo" src={I.photo.src} alt={I.photo.alt} ratio={[2, 5]} sizes="490px" />
      <div className="lg-consult-veil" aria-hidden="true" />
      <div className={`lg-consult-inner${noSticky ? ' no-sticky' : ''}`} ref={inner}>
        {/* 시각 제목 — 같은 문장이 블록 h3(sr-only)로 읽히므로 보조기기에는 숨긴다 */}
        <p className="lg-consult-title" aria-hidden="true">{I.panelTitle[0]}<br />{I.panelTitle[1]}</p>
        <ul className="lg-consult-promise">
          {I.promises.map((p) => (
            <li key={p.text}><LgIcon name={p.icon as LgIconName} size={20} /> {p.text}</li>
          ))}
        </ul>
        <section className="lg-consult-picked" aria-live="polite" aria-label={I.pickedTitle(picked.length)}>
          <p className="lg-consult-ph">{I.pickedTitle(picked.length)}</p>
          {picked.length > 0 ? (
            <ul data-hscroll>
              {picked.map((id) => {
                const c = courseById(id)!;
                return (
                  <li key={id}>
                    <span className="lg-consult-name"><CourseIcon id={id} size={16} />{c.short}</span>
                    <button
                      type="button"
                      className="lg-consult-rm"
                      onClick={() => remove(id)}
                      aria-label={`${c.short} ${I.remove}`}
                      data-ga-id="legal_consult_remove"
                    >
                      <LgIcon name="minus" size={16} /> <span className="lg-consult-rm-t">{I.remove}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="lg-consult-empty">
              <button type="button" className="btn btn-glass lg-consult-add" onClick={() => addMany([...COMMON_PICK])} data-ga-id="legal_consult_add_common">
                <LgIcon name="plus" size={16} /> {I.addCommon}
              </button>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
