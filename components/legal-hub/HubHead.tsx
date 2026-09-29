import AxHead from '@/components/sections/content/AxHead';
import { HUB_COPY } from '@/data/legalHub';
import QuickActions from './QuickActions';
import { LgIcon } from './icons';

/** 허브 헤더 eyebrow 아이콘: Lucide shield-check (TECHSPEC upgrade-02 §3-3 '법정 기준 제목'). 크기는 .ct-eyebrow svg 규칙(15px) */
const HubIcon = () => <LgIcon name="shield-check" size={15} />;

/**
 * 허브 헤더 (legal-B upgrade-01 LB21, §6-1). 다른 축과 같은 AxHead 마크업·클래스, h2 id=mandatory-title.
 * 시즌 문구·내부 탭은 제거하고 빠른 실행 3개로 대체.
 */
export default function HubHead() {
  const H = HUB_COPY.head;
  return (
    <div className="lg-block lg-head">
      <AxHead
        kicker={H.kicker}
        icon={HubIcon}
        titleId="mandatory-title"
        title={<>{H.title[0]}<span className="hl">{H.title[1]}</span></>}
        lead={H.lead}
      />
      <QuickActions />
    </div>
  );
}
