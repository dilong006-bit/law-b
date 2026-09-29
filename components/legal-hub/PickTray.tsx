'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { courseById } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { goConsult } from '@/lib/legal/goConsult';
import { usePick } from '@/lib/legal/pick';
import { LgIcon } from './icons';

const T = HUB_COPY.tray;
/** 가상 키보드를 올리는 입력만 숨김 대상 — 진단·필터 라디오, 체크박스는 제외 */
const TEXT_INPUT = /^(text|email|tel|number|search|url|password)$/;
const isTextEntry = (el: EventTarget | null) =>
  el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement ||
  (el instanceof HTMLInputElement && TEXT_INPUT.test(el.type));

/**
 * 선택 바 (legal-B LB13 → upgrade-01 LB28: CTA '빠른 상담').
 * 표시 조건 4개: 선택 1개 이상 / 허브(#mandatory) 화면 교차 / 문의 자리(#mandatory-inquiry) 비교차 / 텍스트 입력 포커스 아님.
 * 표시 중에는 body.legal-tray-on 으로 맨 위로 버튼을 올리고 인재키움 티저를 숨긴다(components.css).
 */
export default function PickTray() {
  const { picked, remove } = usePick();
  const [inHub, setInHub] = useState(false);
  const [atInquiry, setAtInquiry] = useState(false);
  const [typing, setTyping] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const hub = document.getElementById('mandatory');
    const inq = document.getElementById('mandatory-inquiry');
    const ios: IntersectionObserver[] = [];
    // 고정 nav(72)+SubNav(53) 뒤에 가려진 부분은 '화면에 있음'으로 치지 않는다
    if (hub) { const io = new IntersectionObserver(([e]) => setInHub(e.isIntersecting), { rootMargin: '-125px 0px 0px 0px' }); io.observe(hub); ios.push(io); }
    if (inq) { const io = new IntersectionObserver(([e]) => setAtInquiry(e.isIntersecting)); io.observe(inq); ios.push(io); }
    const onIn = (e: FocusEvent) => setTyping(isTextEntry(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      ios.forEach((io) => io.disconnect());
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  const show = picked.length > 0 && inHub && !atInquiry && !typing;

  useEffect(() => {
    document.body.classList.toggle('legal-tray-on', show);
    if (!show) setListOpen(false);
    return () => document.body.classList.remove('legal-tray-on');
  }, [show]);

  useEffect(() => {
    if (picked.length === 0) setListOpen(false);
  }, [picked.length]);

  useEffect(() => {
    if (!listOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setListOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [listOpen]);


  if (!mounted) return null;

  const names = picked.map((id) => courseById(id)!.short);
  const summary = names.slice(0, 2).join(', ') + (names.length > 2 ? ` ${T.more(names.length - 2)}` : '');

  return createPortal(
    <div className={`lg-tray${show ? ' show' : ''}`} role="region" aria-label={T.listTitle} aria-hidden={!show}>
      <div className="lg-tray-list" id="lg-tray-list" hidden={!listOpen}>
        <p className="lg-tray-lt">{T.listTitle}</p>
        <ul>
          {picked.map((id) => {
            const c = courseById(id)!;
            return (
              <li key={id}>
                <span>{c.short}</span>
                <button type="button" className="lg-tray-rm" onClick={() => remove(id)} aria-label={`${c.short} ${T.remove}`} data-ga-id={`legal-pick-${id}`}>
                  <LgIcon name="minus" size={16} /> {T.remove}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <button type="button" className="lg-tray-sum" aria-expanded={listOpen} aria-controls="lg-tray-list" onClick={() => setListOpen((o) => !o)}>
        <span className="lg-tray-n" key={picked.length}>{T.count(picked.length)}</span>
        <span className="lg-tray-names">{summary}</span>
        <span className="lg-tray-chev" aria-hidden="true"><LgIcon name={listOpen ? 'chevron-down' : 'chevron-up'} size={16} /></span>
      </button>
      {/* 빠른 상담으로 이동(goConsult, 폼 첫 칸 포커스) — 희망과정·요약 패널은 선택 상태와 이미 동기화돼 있다 */}
      <button type="button" className="btn lg-tray-cta" onClick={goConsult} data-ga-id="legal-tray-inquiry">
        {T.cta}
      </button>
    </div>,
    document.body
  );
}
