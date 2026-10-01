// 법정 허브 아이콘 추출 (legal-B upgrade-02 D10, TECHSPEC upgrade-02 §3-1 · upgrade-03 §2)
// 사용법: npm run icons:legal  → lib/legal/iconData.ts 생성 (생성물은 커밋 대상)
// Iconify Lucide 세트에서 NAMES 에 적은 아이콘만 꺼내 SVG body 로 저장한다. 런타임에 세트 전체·Iconify API 를 쓰지 않는다.
import { writeFileSync, readFileSync } from 'node:fs';
import { icons } from '@iconify-json/lucide';
import { getIconData, iconToSVG } from '@iconify/utils';

const NAMES = [
  'search-check', 'layout-grid', 'message-circle', 'clipboard-check', 'plus', 'check', 'minus', 'x',
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'arrow-right', 'external-link',
  'refresh-cw', 'clapperboard', 'headset', 'shield-check',
  'list-checks', 'message-square-text', 'calendar-check', 'monitor-play',
  'download', 'file-text', 'maximize-2', 'clock', 'users',
  // upgrade-03 (시각 고도화): 구분 배지·진단 문항·과정 카드·상세·맞춤 타일·비교표
  'building-2', 'lightbulb', 'briefcase', 'circle-play', 'target', 'user-round', 'puzzle',
  'pen-line', 'sparkles', 'settings-2', 'circle-check',
  // 26827 카드뉴스 고도화 (3장 솔루션 포인트, refresh-cw·headset 은 기존 것)
  'layers',
];

// 과정 아이덴티티 아이콘 (upgrade-03 LB40): 후보를 앞에서부터 찾아 Lucide 에 있는 첫 이름을 쓴다. 키는 LegalCourseId
const COURSE_ICON_CANDIDATES = {
  harassment: ['heart-handshake', 'users-round'],
  sexual: ['shield-user', 'shield-alert', 'shield'],
  disability: ['accessibility'],
  ethics: ['scale'],
  pension: ['piggy-bank'],
  privacy: ['lock-keyhole', 'lock'],
  aml: ['landmark'],
};
const COURSE_ICON = {};
for (const [id, cands] of Object.entries(COURSE_ICON_CANDIDATES)) {
  const hit = cands.find((n) => getIconData(icons, n));
  if (!hit) throw new Error(`과정 ${id}: 후보 아이콘이 lucide 에 모두 없음 (${cands.join(', ')})`);
  COURSE_ICON[id] = hit;
  if (!NAMES.includes(hit)) NAMES.push(hit);
}

const out = {};
for (const n of NAMES) {
  const data = getIconData(icons, n);
  if (!data) throw new Error(`lucide 에 없는 아이콘: ${n}`);
  const { body } = iconToSVG(data);
  // 허브 규격: 24px 격자, stroke 1.5 (Lucide 기본 2)
  out[n] = body.replaceAll('stroke-width="2"', 'stroke-width="1.5"');
}
const ver = JSON.parse(readFileSync(new URL('../node_modules/@iconify-json/lucide/package.json', import.meta.url), 'utf8')).version;
writeFileSync(
  new URL('../lib/legal/iconData.ts', import.meta.url),
  `// 자동 생성 파일. 직접 수정 금지 (scripts/gen-legal-icons.mjs, npm run icons:legal)
// 출처: Iconify Lucide ${ver} (@iconify-json/lucide), ISC License. 24px, stroke 1.5
export const LG_ICONS = ${JSON.stringify(out, null, 2)} as const;
export type LgIconName = keyof typeof LG_ICONS;
/** 과정 id → 아이덴티티 아이콘 (후보 중 선택 결과) */
export const COURSE_ICON = ${JSON.stringify(COURSE_ICON, null, 2)} as const;
`,
);
console.log(`lib/legal/iconData.ts: ${NAMES.length}개 (lucide ${ver})`, COURSE_ICON);
