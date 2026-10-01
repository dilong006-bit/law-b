'use client';
import { useCallback, useRef, useState } from 'react';

/**
 * 필드 단위 실시간 검증 (26827 VAL-01~08).
 * 값(values)은 폼이 그대로 소유한다. 이 훅은 오류 노출 시점만 관리한다.
 * - rules: 키별 검증 함수. true 를 돌려주면 오류
 * - 오류 노출 조건: errors[key] && (touched[key] || submitted)
 */
export type FieldRules<K extends string> = Record<K, (value: string) => boolean>;

type Flags<K extends string> = Partial<Record<K, boolean>>;

interface Options<K extends string> {
  /** 오류 문구 id 접두어. 오류 문구 id = `${idPrefix}err-${key}` */
  idPrefix: string;
  /** 입력값 반영 (폼의 기존 setState 연결) */
  onValueChange: (key: K, value: string) => void;
}

/** 이 속성을 가진 요소(모달 닫기 버튼 등)로 포커스가 옮겨 가는 blur 는 검증하지 않는다 */
const SKIP_ATTR = 'data-skip-blur-validate';

export function useFieldValidation<K extends string>(rules: FieldRules<K>, { idPrefix, onValueChange }: Options<K>) {
  const [errors, setErrors] = useState<Flags<K>>({});
  const [touched, setTouched] = useState<Flags<K>>({});
  const [dirty, setDirty] = useState<Flags<K>>({});
  const [submitted, setSubmitted] = useState(false);
  const refs = useRef<Partial<Record<K, HTMLInputElement | null>>>({});

  const validateField = (key: K, value: string) => rules[key](value ?? '');
  const showError = (key: K) => !!errors[key] && (!!touched[key] || submitted);
  const errId = (key: K) => `${idPrefix}err-${key}`;

  function onChange(key: K, e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    onValueChange(key, value);
    setDirty((s) => (s[key] ? s : { ...s, [key]: true }));
    // 이미 오류가 보이는 필드만 입력 중 재검증한다. 오류가 없던 필드는 입력 중 오류를 띄우지 않는다.
    if (showError(key)) setErrors((s) => ({ ...s, [key]: validateField(key, value) }));
  }

  function onBlur(key: K, e: React.FocusEvent<HTMLInputElement>) {
    // 닫기 버튼으로 이동하거나, 모달이 이미 닫히는 중(ESC·오버레이)이면 검증하지 않는다
    const to = e.relatedTarget as HTMLElement | null;
    if (to?.closest(`[${SKIP_ATTR}]`)) return;
    if (e.currentTarget.closest('.pv-overlay:not(.open)')) return;
    // 자동완성처럼 onChange 없이 채워진 값도 blur 시점 DOM 값으로 반영·검증한다
    const value = e.target.value;
    onValueChange(key, value);
    setTouched((s) => (s[key] ? s : { ...s, [key]: true }));
    // 포커스만 했다가 비운 채 떠나면 오류를 띄우지 않는다(한 번이라도 입력했으면 검증)
    if (!value.trim() && !dirty[key]) return;
    setErrors((s) => ({ ...s, [key]: validateField(key, value) }));
  }

  /** input 에 스프레드할 속성 */
  function bind(key: K) {
    const shown = showError(key);
    return {
      ref: (el: HTMLInputElement | null) => { refs.current[key] = el; },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(key, e),
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => onBlur(key, e),
      'aria-invalid': shown,
      // 숨겨진 오류 문구가 정상 상태에서 읽히지 않도록 표시 중일 때만 연결한다
      'aria-describedby': shown ? errId(key) : undefined,
    };
  }

  /** 오류 문구 span 에 스프레드할 속성. 표시될 때만 alert 로 낭독한다 */
  function errProps(key: K) {
    return { id: errId(key), role: showError(key) ? 'alert' : undefined };
  }

  /** 전 필드 검증. 첫 오류 필드 key 를 돌려주고(없으면 null) 그 필드로 포커스를 옮긴다 */
  function validateAll(values: Record<K, string>): K | null {
    const next: Flags<K> = {};
    let first: K | null = null;
    (Object.keys(rules) as K[]).forEach((k) => {
      const bad = validateField(k, values[k]);
      next[k] = bad;
      if (bad && first === null) first = k;
    });
    setErrors(next);
    setSubmitted(true);
    if (first !== null) refs.current[first as K]?.focus();
    return first;
  }

  const reset = useCallback(() => {
    setErrors({}); setTouched({}); setDirty({}); setSubmitted(false);
  }, []);

  return { bind, errProps, showError, validateAll, reset };
}
