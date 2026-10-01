'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FI_CTA_MOBILE } from '@/data/floatingInquiry';
import { resolveHref } from '@/lib/fi/state';
import { useFloatingInquiry } from '@/lib/useFloatingInquiry';
import { LgIcon } from '@/components/legal-hub/icons';

/** 바 노출 중 하단 스크롤 여백 (styles/floating-inquiry.css 의 html:has(body.fi-on) 값과 같음) */
const PAD_PC = '104px';
const PAD_MOBILE = '88px';

/**
 * 플로팅 문의 바 (B안 기술명세서 최종 v2.0 §5, FI-01·FI-10). layout 에서 footer 뒤 1회 마운트.
 * 노출 판정은 useFloatingInquiry, 여기서는 렌더와 body.fi-on 동기화만 한다.
 * 숨김 상태는 aria-hidden + inert (React 18 은 inert prop 미지원이라 ref 로 DOM 속성을 직접 준다).
 */
export default function FloatingInquiry() {
  const { page, copy, visible, dismiss } = useFloatingInquiry();
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

  if (!page || !copy) return null;

  const href = resolveHref(page, copy);
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
          <Link className="fi-cta" href={href} data-ga-id="floating_inquiry_click">{inner}</Link>
        ) : (
          <a className="fi-cta" href={href} data-ga-id="floating_inquiry_click">{inner}</a>
        )}
        <button type="button" className="fi-close" onClick={dismiss} aria-label="빠른 상담 바 닫기" data-ga-id="floating_inquiry_close">
          <LgIcon name="x" size={18} />
        </button>
      </div>
    </aside>
  );
}
