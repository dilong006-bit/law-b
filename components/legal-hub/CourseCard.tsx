'use client';

import Img from '@/components/common/Img';
import { lawOf, previewUrl, type LegalCourse } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { usePick } from '@/lib/legal/pick';
import { IcCheck, IcExternal, IcPlus } from './icons';

const L = HUB_COPY.lineup;

/** 구분 배지 문구 — 업종별은 kindNote 병기 (예: 업종별 · 금융) */
export const kindText = (c: LegalCourse) => L.kindLabel[c.kind] + (c.kindNote ? ` · ${c.kindNote}` : '');

/**
 * 과정 카드 (legal-B LB6). 썸네일·제목·자세히 보기는 같은 상세를 연다.
 * 썸네일 버튼은 포인터 편의용이라 탭 순서에서 뺀다(같은 동작의 제목·자세히 보기가 키보드 경로).
 */
export default function CourseCard({ course, open, detailId, onToggle }: {
  course: LegalCourse; open: boolean; detailId: string; onToggle: () => void;
}) {
  const pick = usePick();
  const picked = pick.has(course.id);
  const law = lawOf(course.lawKey);

  return (
    <article className="lg-card" data-picked={picked ? 'true' : undefined}>
      <div className="lg-card-media">
        <button type="button" className="lg-card-thumb" tabIndex={-1} aria-hidden="true" onClick={onToggle}>
          <Img src={course.thumb} />
        </button>
        <button
          type="button"
          className="lg-pick"
          aria-pressed={picked}
          aria-label={`${course.short} ${L.pick}`}
          onClick={() => pick.toggle(course.id)}
          data-ga-id={`legal-pick-${course.id}`}
        >
          {picked ? <IcCheck /> : <IcPlus />}
        </button>
      </div>
      <div className="lg-card-body">
        <div className="lg-meta">
          <span className={`lg-kind k-${course.kind}`}>{kindText(course)}</span>
          <span className="lg-sess">{course.sessions}{L.sessionsUnit}</span>
        </div>
        <h3 className="lg-card-h">
          <button type="button" className="lg-card-title" aria-expanded={open} aria-controls={detailId} onClick={onToggle}>
            {course.short}
          </button>
        </h3>
        {law && <p className="lg-card-sub">{HUB_COPY.law.cols[3]} {law.대상} · {law.주기}</p>}
        <div className="lg-card-acts">
          <button type="button" className="lg-link" aria-expanded={open} aria-controls={detailId} onClick={onToggle} data-ga-id={`legal-detail-${course.id}`}>
            {L.detail}
          </button>
          <a
            className="lg-link"
            href={previewUrl(course.classkey)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${course.name} ${L.preview} (새 창)`}
            data-ga-id={`legal-preview-${course.id}`}
          >
            {L.preview} <IcExternal />
          </a>
        </div>
      </div>
    </article>
  );
}
