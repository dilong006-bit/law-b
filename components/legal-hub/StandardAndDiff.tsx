'use client';

import { useState } from 'react';
import { AX5 } from '@/data/content';
import { HUB_COPY } from '@/data/legalHub';
import type { LgIconName } from '@/lib/legal/iconData';
import BlockHead from './BlockHead';
import LawTable from './LawTable';
import { LgIcon } from './icons';

const W = HUB_COPY.law;
const F = HUB_COPY.diff;
const ICON: Record<string, LgIconName> = { series: 'refresh-cw', story: 'clapperboard', ops: 'headset' };

/**
 * 법정 기준 + KG에듀원 차이 (legal-B upgrade-01 LB24 — LB8 변경, LB9·LB10 흡수).
 * 위: 법정 기준 표 12열 전폭 / 아래: 차이 카드 3장(4+4+4, 짝 관계 peer, 높이 동일)
 * 몰입형 스토리 카드의 '비교표 보기' 는 카드 행 아래 12열에 비교표를 펼친다(카드 높이 불변).
 * 운영 카드는 확인된 2개 항목만(이수 현황·미이수자 문구 없음). 타임라인은 연도·시리즈명·현재만(외부 작품명 금지).
 */
export default function StandardAndDiff() {
  const [open, setOpen] = useState(false);
  const [hKey, hGen, hOwn] = AX5.diffHead;
  return (
    <div className="lg-block lg-anchor" id="mandatory-law">
      <BlockHead kicker={W.kicker} title={W.title} />
      <LawTable />

      <h4 className="lg-sub-title lg-diff-h">{F.title}</h4>
      <div className="lg-row lg-diffc" data-balance-row data-pair="peer">
        {F.cards.map((c) => (
          <article className="lg-c4 lg-box lg-diffcard" key={c.key}>
            <span className="lg-ico-tile"><LgIcon name={ICON[c.key]} size={24} /></span>
            <h5 className="lg-diffcard-t">{c.title}</h5>
            {'desc' in c && <p className="lg-diffcard-d">{c.desc}</p>}
            {c.key === 'series' && (
              <div className="timeline lg-mini-tl">
                {AX5.timeline.map((t) => (
                  <div className={`tnode${t.cur ? ' cur' : ''}`} key={t.yr}>
                    <div className="dot" /><div className="yr">{t.yr}</div><div className="nm">{t.nm}</div>
                    {t.cur && <div className="bn">{F.current}</div>}
                  </div>
                ))}
              </div>
            )}
            {'items' in c && (
              <ul className="lg-diffcard-list">
                {c.items.map((it) => <li key={it}><LgIcon name="check" size={18} /> <span>{it}</span></li>)}
              </ul>
            )}
            {'more' in c && (
              <div className="lg-box-foot">
                <button type="button" className="btn btn-line-dark lg-diff-toggle" aria-expanded={open} aria-controls="lg-diff-table" onClick={() => setOpen((o) => !o)}>
                  {open ? c.less : c.more} <LgIcon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* 비교표: 카드 행 아래 12열. 기존 .difftable + 640 이하 항목별 카드(같은 AX5.diff 데이터) */}
      <div id="lg-diff-table" className="lg-diff-panel" hidden={!open}>
        <div className="difftable">
          <table>
            <thead><tr><th scope="col">{hKey}</th><th scope="col">{hGen}</th><th scope="col">{hOwn}</th></tr></thead>
            <tbody>{AX5.diff.map((r, i) => (
              <tr key={r[0]}>
                <td><span className="lg-diff-rl"><LgIcon name={F.rowIcons[i]} size={20} />{r[0]}</span></td>
                <td>{r[1]}</td>
                <td><span className="lg-diff-kg"><LgIcon name={F.kgMark} size={18} />{r[2]}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <ul className="lg-diff-m">
          {AX5.diff.map((r, i) => (
            <li key={r[0]}>
              <h5 className="lg-diff-t"><LgIcon name={F.rowIcons[i]} size={20} />{r[0]}</h5>
              <dl>
                <div><dt>{hGen}</dt><dd>{r[1]}</dd></div>
                <div className="own"><dt>{hOwn}</dt><dd><span className="lg-diff-kg"><LgIcon name={F.kgMark} size={18} />{r[2]}</span></dd></div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
