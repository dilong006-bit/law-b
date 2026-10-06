'use client';

import { useState, type CSSProperties } from 'react';
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
 * upgrade-04 LB51: 블록 2개로 분리. 법정 기준(#mandatory-law)은 law.show 플래그 비표시(D27, 표·데이터 보존),
 * 차별점(#mandatory-diff)은 독립 블록. 카드 2장이면 c6(641 이상 2열, D30), 3장이면 c4 (짝 관계 peer, 높이 동일)
 * 몰입형 스토리 카드의 '비교표 보기' 는 카드 행 아래 12열에 비교표를 펼친다(카드 높이 불변).
 * 카드 제목은 블록 제목(h3) 아래 h4. 타임라인은 연도·시리즈명·현재만(외부 작품명 금지).
 */
export default function StandardAndDiff() {
  const [open, setOpen] = useState(false);
  const [hKey, hGen, hOwn] = AX5.diffHead;
  const col = F.cards.length === 2 ? 'lg-c6' : 'lg-c4';
  return (
    <>
    {W.show && (
      <div className="lg-block lg-anchor" id="mandatory-law">
        <BlockHead kicker={W.kicker} title={W.title} />
        <LawTable />
      </div>
    )}
    <div className="lg-block lg-anchor" id="mandatory-diff">
      <BlockHead kicker={F.kicker} title={F.title} />
      <div className="lg-row lg-diffc" data-balance-row data-pair="peer" style={{ '--lg-n': F.cards.length } as CSSProperties}>
        {F.cards.map((c) => (
          <article className={`${col} lg-box lg-diffcard`} key={c.key}>
            <span className="lg-ico-tile"><LgIcon name={ICON[c.key]} size={24} /></span>
            <h4 className="lg-diffcard-t">{c.title}</h4>
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
    </>
  );
}
