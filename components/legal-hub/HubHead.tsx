'use client';

import AxHead from '@/components/sections/content/AxHead';
import { HUB_COPY } from '@/data/legalHub';
import { useEdgeFade } from './useEdgeFade';

/**
 * 허브 헤더 + 허브 내부 탭 (legal-B LB4).
 * AxHead 마크업·클래스 재사용, h2 id=mandatory-title.
 * 탭 스크롤러는 기존 .subnav-in(가로 스크롤·엣지 페이드 mask)을 그대로 쓴다 — data-fade 만 여기서 갱신.
 */
export default function HubHead({ icon }: { icon: () => JSX.Element }) {
  const H = HUB_COPY.head;
  const scroller = useEdgeFade<HTMLDivElement>();

  return (
    <div className="lg-head">
      <AxHead
        kicker={H.kicker}
        icon={icon}
        titleId="mandatory-title"
        title={<>{H.title[0]}<span className="hl">{H.title[1]}</span></>}
        lead={H.lead}
      />
      <p className="lg-season">{H.season}</p>
      <nav className="lg-tabs" aria-label="법정 허브 바로가기">
        <div className="subnav-in lg-tabs-in" ref={scroller} data-fade="none">
          {H.tabs.map((t) => (
            <a className="lg-tab" href={`#${t.id}`} key={t.id}>{t.label}</a>
          ))}
        </div>
      </nav>
    </div>
  );
}
