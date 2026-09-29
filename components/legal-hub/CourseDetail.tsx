'use client';

import Img from '@/components/common/Img';
import { lawOf, previewUrl, type LegalCourse } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { usePick } from '@/lib/legal/pick';
import { kindText } from './CourseCard';
import { IcChevL, IcChevR, IcClose, IcExternal } from './icons';

const L = HUB_COPY.lineup;
const DL = L.detailLabels;

/**
 * 과정 상세 (legal-B LB7). 인라인(761 이상)과 바텀시트(760 이하)가 같은 내용을 쓴다.
 * 교육비는 데이터에 없다. outline 이 null 이면 '주요 학습 내용' 섹션 자체를 그리지 않는다.
 * onClose: 인라인에서만 넘긴다(시트는 자체 닫기 버튼을 가진다).
 */
export default function CourseDetail({ course, titleId, prev, next, onGo, onClose }: {
  course: LegalCourse; titleId: string;
  prev: LegalCourse | null; next: LegalCourse | null;
  onGo: (c: LegalCourse) => void; onClose?: () => void;
}) {
  const pick = usePick();
  const picked = pick.has(course.id);
  const law = lawOf(course.lawKey);
  const d = course.detail;

  return (
    <div className="lg-detail">
      {onClose && (
        <button type="button" className="lg-dclose" onClick={onClose} aria-label={L.close}><IcClose /></button>
      )}
      <div className="lg-dhead">
        <div className="lg-dthumb"><Img src={course.thumb} /></div>
        <div className="lg-dhead-t">
          <div className="lg-meta">
            <span className={`lg-kind k-${course.kind}`}>{kindText(course)}</span>
            <span className="lg-sess">{course.sessions}{L.sessionsUnit}</span>
          </div>
          <h3 id={titleId} className="lg-dtitle">{course.name}</h3>
        </div>
      </div>

      <div className="lg-dbody">
        <div className="lg-dcol">
          <section className="lg-dsec">
            <h4>{DL.audience}</h4>
            <ul className="lg-dlist">{d.audience.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
          <section className="lg-dsec">
            <h4>{DL.goals}</h4>
            <ul className="lg-dlist">{d.goals.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
          {d.outline && (
            <section className="lg-dsec">
              <h4>{DL.outline}</h4>
              <ol className="lg-doutline">{d.outline.map((t) => <li key={t}>{t}</li>)}</ol>
            </section>
          )}
        </div>
        <div className="lg-dcol">
          <section className="lg-dsec">
            <h4>{DL.instructor}</h4>
            <p className="lg-dinst"><b>{d.instructor.name}</b> · {d.instructor.bio}</p>
          </section>
          {law && (
            <section className="lg-dsec">
              <h4>{DL.law}</h4>
              <dl className="lg-dlaw">
                <div><dt>{HUB_COPY.law.cols[2]}</dt><dd>{law.근거}</dd></div>
                <div><dt>{HUB_COPY.law.cols[3]}</dt><dd>{law.대상}</dd></div>
                <div><dt>{HUB_COPY.law.cols[4]}</dt><dd>{law.주기}</dd></div>
              </dl>
            </section>
          )}
        </div>
      </div>

      <div className="lg-dfoot">
        <div className="lg-dacts">
          <button type="button" className="btn btn-ink lg-dpick" aria-pressed={picked} onClick={() => pick.toggle(course.id)} data-ga-id={`legal-pick-${course.id}`}>
            {picked ? L.picked : L.pick}
          </button>
          <a
            className="btn btn-line-dark lg-dprev-link"
            href={previewUrl(course.classkey)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${course.name} ${L.preview} (새 창)`}
            data-ga-id={`legal-preview-${course.id}`}
          >
            {L.previewFull} <IcExternal />
          </a>
        </div>
        <div className="lg-dnav">
          <button type="button" className="lg-dnav-btn" disabled={!prev} onClick={() => prev && onGo(prev)} aria-label={prev ? `${L.prev}: ${prev.short}` : L.prev}>
            <IcChevL /> {L.prev}
          </button>
          <button type="button" className="lg-dnav-btn" disabled={!next} onClick={() => next && onGo(next)} aria-label={next ? `${L.next}: ${next.short}` : L.next}>
            {L.next} <IcChevR />
          </button>
        </div>
      </div>
    </div>
  );
}
