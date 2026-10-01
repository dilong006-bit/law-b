'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FI_CTA_MOBILE } from '@/data/floatingInquiry';
import { goToForm } from '@/lib/fi/go';
import { resolveHref, zoneName } from '@/lib/fi/state';
import { firstInSession, track } from '@/lib/legal/track';
import { useFloatingInquiry } from '@/lib/useFloatingInquiry';
import { LgIcon } from '@/components/legal-hub/icons';

/** 바 노출 중 하단 스크롤 여백 (styles/floating-inquiry.css 의 html:has(body.fi-on) 값과 같음) */
const PAD_PC = '104px';
const PAD_MOBILE = '88px';

/**
 * 플로팅 문의 바 본체 (B안 기술명세서 최종 v2.0 §5·§7·§8, FI-01·05·10·13). FloatingInquiry 가 하이드레이션 뒤 비동기로 불러온다.
 * 노출 판정은 useFloatingInquiry, 여기서는 렌더·body.fi-on 동기화·클릭·계측만 한다.
 * 숨김 상태는 aria-hidden + inert (React 18 은 inert prop 미지원이라 ref 로 DOM 속성을 직접 준다).
 * Esc 로는 닫지 않는다 (모달 Esc 와 충돌 방지). Enter·Space 는 링크·버튼 기본 동작.
 */
export default function FloatingInquiryBar() {
  const { page, copy, activeZone, visible, dismiss } = useFloatingInquiry();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.inert = !visible;
  }, [visible, page]);

  // 하단 요소 보정: visible 이 바뀔 때만 토글, 언마운트 시 제거
  useEffect(() => {
    const html = document.documentElement;
    document.body.classList.toggle('fi-on', visible);
    if (visible) html.style.scrollPaddingBottom = window.matchMedia('(max-width:760px)').matches ? PAD_MOBILE : PAD_PC;
    else html.style.removeProperty('scroll-padding-bottom');
    return () => {
      document.body.classList.remove('fi-on');
      html.style.removeProperty('scroll-padding-bottom');
    };
  }, [visible]);

  // FI-13 view: 세션·페이지당 첫 노출 1회
  const path = page?.path;
  useEffect(() => {
    if (visible && path && firstInSession(`keess_fi_viewed:${path}`)) track('floating_inquiry_view', { page: path });
  }, [visible, path]);

  if (!page || !copy) return null;

  const href = resolveHref(page, copy);
  const onClickTrack = () => track('floating_inquiry_click', { page: page.path, zone: zoneName(activeZone) });
  const onGo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClickTrack();
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goToForm(page.target, copy.interest);
  };
  const onClose = () => {
    track('floating_inquiry_close', { page: page.path });
    dismiss();
  };

  const inner = (
    <>
      <span className="fi-cta-full">{copy.cta}</span>
      <span className="fi-cta-short">{FI_CTA_MOBILE}</span>
      <LgIcon name="arrow-right" size={18} className="fi-cta-ic" />
    </>
  );

  return (
    <aside
      ref={ref}
      className={`fi${visible ? ' is-on' : ''}`}
      aria-label="빠른 교육 상담"
      aria-hidden={visible ? undefined : true}
      data-accent={copy.accent}
    >
      <div className="fi-card">
        <span className="fi-dot" aria-hidden="true" />
        <p className="fi-msg" key={copy.title}>
          <strong className="fi-title">{copy.title}</strong>
          <strong className="fi-short">{copy.short}</strong>
          <span className="fi-sub">{copy.sub}</span>
        </p>
        {page.external ? (
          // AX·AI: 홈 폼으로 이동 (?interest=ax-ai 사전 선택은 홈 기존 로직)
          <Link className="fi-cta" href={href} onClick={onClickTrack} data-ga-id="floating_inquiry_click">{inner}</Link>
        ) : (
          <a className="fi-cta" href={href} onClick={onGo} data-ga-id="floating_inquiry_click">{inner}</a>
        )}
        <button type="button" className="fi-close" onClick={onClose} aria-label="빠른 상담 바 닫기" data-ga-id="floating_inquiry_close">
          <LgIcon name="x" size={18} />
        </button>
      </div>
    </aside>
  );
}
