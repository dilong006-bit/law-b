import AxHead from '@/components/sections/content/AxHead';
import { HUB_COPY } from '@/data/legalHub';
import QuickActions from './QuickActions';

/**
 * 허브 헤더 (legal-B upgrade-01 LB21, §6-1). 다른 축과 같은 AxHead 마크업·클래스, h2 id=mandatory-title.
 * 시즌 문구·내부 탭은 제거하고 빠른 실행 3개로 대체.
 */
export default function HubHead({ icon }: { icon: () => JSX.Element }) {
  const H = HUB_COPY.head;
  return (
    <div className="lg-block lg-head">
      <AxHead
        kicker={H.kicker}
        icon={icon}
        titleId="mandatory-title"
        title={<>{H.title[0]}<span className="hl">{H.title[1]}</span></>}
        lead={H.lead}
      />
      <QuickActions />
    </div>
  );
}
