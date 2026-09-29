import { LEGAL_COURSES, lawOf } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { kindText } from './CourseCard';

const W = HUB_COPY.law;

/** 한 번만 계산하는 행 데이터 — 표와 카드가 같은 배열을 쓴다(데이터 이중 기재 금지) */
const ROWS = LEGAL_COURSES.map((c) => {
  const l = lawOf(c.lawKey);
  return { c, basis: l?.근거 ?? W.consult, target: l?.대상 ?? W.consult, cycle: l?.주기 ?? W.consult, known: !!l };
});

/**
 * 법정 기준 (legal-B LB8). 과태료 열 없음.
 * 구분은 과정 kind(괴롭힘 = 권고), 근거·대상·주기는 lawOf(AX5.laws), 근거 없는 과정은 '상담 시 안내'.
 * 881 이상 5열 / 880 이하 대상·주기 합친 4열 / 640 이하 과정별 카드 — CSS 로 하나만 보인다.
 * upgrade-01 LB24: 블록 래퍼·제목은 StandardAndDiff 가 가진다(이 컴포넌트는 표 본문만).
 */
export default function LawTable() {
  const [cEdu, cKind, cBasis, cTarget, cCycle] = W.cols;
  return (
    <>
      <div className="lg-law">
        <table>
          <thead>
            <tr>
              <th scope="col">{cEdu}</th>
              <th scope="col">{cKind}</th>
              <th scope="col">{cBasis}</th>
              <th scope="col" className="lg-law-sep">{cTarget}</th>
              <th scope="col" className="lg-law-sep">{cCycle}</th>
              <th scope="col" className="lg-law-mix">{cTarget} · {cCycle}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ c, basis, target, cycle, known }) => (
              <tr key={c.id} className={known ? undefined : 'unk'}>
                <th scope="row">{c.short}</th>
                <td><span className={`lg-kind k-${c.kind}`}>{kindText(c)}</span></td>
                <td>{basis}</td>
                <td className="lg-law-sep">{target}</td>
                <td className="lg-law-sep">{cycle}</td>
                <td className="lg-law-mix">{known ? `${target} · ${cycle}` : W.consult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="lg-law-m">
        {ROWS.map(({ c, basis, target, cycle, known }) => (
          <li key={c.id} className={known ? undefined : 'unk'}>
            <div className="lg-law-mh"><h4>{c.short}</h4><span className={`lg-kind k-${c.kind}`}>{kindText(c)}</span></div>
            <dl>
              <div><dt>{cBasis}</dt><dd>{basis}</dd></div>
              <div><dt>{cTarget}</dt><dd>{target}</dd></div>
              <div><dt>{cCycle}</dt><dd>{cycle}</dd></div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="lg-law-basis">{W.basis}</p>
      <ul className="lg-law-notes">
        {W.notes.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </>
  );
}
