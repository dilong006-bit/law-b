'use client';

/**
 * 법정 허브 선택 상태 (기술명세서 legal-B §4, PRD LB5·6·7·13·14).
 * 과정 id 배열 하나를 진단·카드·상세·선택 바·문의 폼이 함께 읽고 쓴다.
 * - picked 는 항상 LEGAL_COURSES.order 순, 중복 없음
 * - 저장은 메모리만 (새로고침 시 초기화, localStorage 등 외부 저장 금지)
 * - Provider 위치: LegalHub 루트 (허브 안에서만)
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LEGAL_COURSES, type LegalCourseId } from '@/data/legal';

type Prefill = { company?: string; name?: string; email?: string };

interface PickCtx {
  picked: LegalCourseId[];               // order 순 정렬 유지
  has: (id: LegalCourseId) => boolean;
  toggle: (id: LegalCourseId) => void;
  addMany: (ids: LegalCourseId[]) => void; // 합집합
  remove: (id: LegalCourseId) => void;
  setFromOptions: (options: string[]) => void; // 폼 체크 → 상태
  prefill: Prefill;
  setPrefill: (p: Prefill) => void;
}

/* ── 순수 헬퍼 (React 비의존, 검증 스크립트에서도 쓴다) ───────────────── */

/** 알려진 id 만 남기고 중복 제거 후 order 순으로 정렬한다 */
export const normalizePicked = (ids: readonly LegalCourseId[]): LegalCourseId[] =>
  LEGAL_COURSES.filter((c) => ids.includes(c.id)).map((c) => c.id);

/** 합집합 (이미 담은 과정은 그대로, 순서는 order) */
export const unionPicked = (a: readonly LegalCourseId[], b: readonly LegalCourseId[]) => normalizePicked([...a, ...b]);

/** 희망과정 option 라벨 → id. 매칭되지 않는 값('기타' 포함)은 무시한다 */
export const idsFromOptions = (options: readonly string[]): LegalCourseId[] =>
  normalizePicked(LEGAL_COURSES.filter((c) => options.includes(c.option)).map((c) => c.id));

/** id → 희망과정 option 라벨 (문의 폼 동기화용, order 순) */
export const optionsOf = (ids: readonly LegalCourseId[]): string[] =>
  normalizePicked(ids).map((id) => LEGAL_COURSES.find((c) => c.id === id)!.option);

/* ── Provider ─────────────────────────────────────────────────────────── */

const Ctx = createContext<PickCtx | null>(null);

export function PickProvider({ children }: { children: React.ReactNode }) {
  const [picked, setPicked] = useState<LegalCourseId[]>([]);
  const [prefill, setPrefillState] = useState<Prefill>({});

  const toggle = useCallback((id: LegalCourseId) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : normalizePicked([...p, id]))), []);
  const addMany = useCallback((ids: LegalCourseId[]) => setPicked((p) => unionPicked(p, ids)), []);
  const remove = useCallback((id: LegalCourseId) => setPicked((p) => p.filter((x) => x !== id)), []);
  // upgrade-04 LB55: 결과가 기존과 같으면 이전 배열을 그대로 둔다 (불필요한 재렌더·폼 동기화 이펙트 차단)
  const setFromOptions = useCallback((options: string[]) => setPicked((p) => {
    const next = idsFromOptions(options);
    return next.length === p.length && next.every((id, i) => id === p[i]) ? p : next;
  }), []);
  const setPrefill = useCallback((p: Prefill) => setPrefillState({ ...p }), []);

  const value = useMemo<PickCtx>(() => ({
    picked,
    has: (id) => picked.includes(id),
    toggle, addMany, remove, setFromOptions,
    prefill, setPrefill,
  }), [picked, prefill, toggle, addMany, remove, setFromOptions, setPrefill]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const NOOP: PickCtx = {
  picked: [], has: () => false, toggle: () => {}, addMany: () => {}, remove: () => {},
  setFromOptions: () => {}, prefill: {}, setPrefill: () => {},
};

export function usePick(): PickCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // 개발 모드에서만 명확히 알린다. 운영에서는 빈 상태로 조용히 동작해 화면이 깨지지 않게 한다.
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('usePick() 은 <PickProvider> 안에서만 호출할 수 있습니다. LegalHub 루트에 PickProvider 가 있는지 확인하세요.');
    }
    return NOOP;
  }
  return ctx;
}
