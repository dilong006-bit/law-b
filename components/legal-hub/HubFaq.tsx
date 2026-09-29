import { HUB_COPY } from '@/data/legalHub';

/**
 * 실무 FAQ (legal-B LB12, Could). 답변이 확정되어 HUB_COPY.faq.show 가 true 가 될 때만 LegalHub 가 렌더한다.
 * 질문만 노출하는 상태는 만들지 않는다 — 답변이 빈 항목은 걸러낸다.
 */
export default function HubFaq() {
  const items = HUB_COPY.faq.items.filter((it) => it.q && it.a);
  if (!items.length) return null;
  return (
    <div className="lg-block lg-faq">
      <ul>
        {items.map((it) => (
          <li key={it.q}>
            <details>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
