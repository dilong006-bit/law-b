'use client';

import type { CardNewsItem, CardNewsTemplate } from '@/data/legal';
import CardNewsLogo from './CardNewsLogo';
import { LgIcon } from './icons';
import LgPhoto from './LgPhoto';

/** 템플릿별 사진 비율 (기술명세서 §3.4): opening 2:1, problem 1080:562, solution 1080:302 (우하단 여유 확보로 30cqw 에서 28cqw), closing 4:5 */
const PHOTO_RATIO: Record<CardNewsTemplate, readonly [number, number]> = {
  opening: [2, 1], problem: [1080, 562], solution: [1080, 302], closing: [4, 5],
};
const PHOTO_WIDTHS = [360, 540, 720, 1080] as const;
const LOGO_TONE = { opening: 'ink', problem: 'chip', solution: 'chip', closing: 'white' } as const;

/**
 * 카드뉴스 한 장 (26827 카드뉴스 고도화 CN-02·CN-03, 기술명세서 v1.0 §3).
 * - item.image 가 있으면 디자이너 최종 JPG (alt = 장 전문), 없으면 템플릿 HTML 카드
 * - HTML 카드는 1080 원본을 100cqw 로 둔 비례 단위만 쓴다 (.cnx container-type inline-size, 4:5). 슬라이드·확대 보기가 같은 컴포넌트, 크기만 다름
 * - 사진은 장식(alt=""). 실패 시 사진 자리만 그라데이션이 남고 글자는 그대로 (onFail 은 JPG 모드에서만 부른다)
 * - 우하단 16.667cqw 는 확대 버튼 자리라 글자·로고를 두지 않는다
 * 전부 span 으로 쓴다: 슬라이드에서는 button(.lg-cn-open) 안에 들어가므로 구문 콘텐츠만 허용된다.
 */
export default function CardNewsFace({ item, eager = false, sizes, onImageFail }: {
  item: CardNewsItem;
  eager?: boolean;
  sizes?: string;
  /** JPG 모드에서 이미지 로드 실패 (확대 비활성용) */
  onImageFail?: () => void;
}) {
  if (item.image) {
    return (
      <span className="cnx cnx--image" data-mode="image">
        <LgPhoto className="cnx-jpg" src={item.image} alt={item.alt} ratio={[4, 5]} eager={eager} onFail={onImageFail} />
      </span>
    );
  }

  const t = item.template;
  return (
    <span className={`cnx cnx--${t}`} data-mode="html" data-template={t}>
      <LgPhoto
        className="cnx-photo"
        src={item.photo.src}
        ratio={PHOTO_RATIO[t]}
        fp={{ x: item.photo.fpX, y: item.photo.fpY }}
        widths={PHOTO_WIDTHS}
        sizes={sizes ?? '(max-width: 760px) calc(100vw - 64px), 400px'}
        eager={eager}
      />
      {t !== 'solution' && <span className="cnx-shade" aria-hidden="true" />}
      <CardNewsLogo tone={LOGO_TONE[t]} />
      <span className="cnx-txt">
        {item.label && <span className="cnx-label">{item.label}</span>}
        <span className="cnx-title">
          {item.title.map((line) => <span key={line} className="cnx-line">{line}</span>)}
        </span>
        {item.body && <span className="cnx-body">{item.body}</span>}
        {item.emphasis && <span className="cnx-em">{item.emphasis}</span>}
        {item.points && (
          <span className="cnx-points">
            {item.points.map((p) => (
              <span key={p.title} className="cnx-pt">
                <span className="cnx-pt-ic"><LgIcon name={p.icon} /></span>
                <span className="cnx-pt-tx">
                  <span className="cnx-pt-t">{p.title}</span>
                  <span className="cnx-pt-d">{p.desc}</span>
                </span>
              </span>
            ))}
          </span>
        )}
      </span>
      {item.footer && <span className="cnx-foot">{item.footer}</span>}
    </span>
  );
}
