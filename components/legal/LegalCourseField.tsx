'use client';

import type { CourseFieldConfig } from '@/lib/legal/courseField';

interface LegalCourseFieldProps {
  config: CourseFieldConfig;
  selected: Record<string, boolean>;
  onToggle: (option: string) => void;
  etcOn: boolean;
  onEtcToggle: (on: boolean) => void;
  etcText: string;
  onEtcText: (text: string) => void;
  /** 'required' = 1개도 고르지 않음, 'etc' = 기타를 켜고 비워 둠 */
  error: 'required' | 'etc' | null;
}

/**
 * LF8 희망과정 선택 필드. 폼의 다른 필드와 같은 .field 문법을 쓰고,
 * 오류는 제출 시 켜지며 입력 즉시 풀린다(기존 라이브 인라인 검증 규칙).
 */
export default function LegalCourseField({
  config, selected, onToggle, etcOn, onEtcToggle, etcText, onEtcText, error,
}: LegalCourseFieldProps) {
  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      <fieldset className="lg-course-fs">
        <legend>
          {config.label} <span className="req">*</span>
        </legend>
        <div className="lg-course-field">
          {config.options.map((o, i) => (
            <label key={o}>
              <input
                type="checkbox"
                id={i === 0 ? 'f-course-0' : undefined}
                checked={!!selected[o]}
                onChange={() => onToggle(o)}
              />
              {o}
            </label>
          ))}
          <label className="lg-course-etc">
            <input type="checkbox" checked={etcOn} onChange={(e) => onEtcToggle(e.target.checked)} />
            {config.etcLabel}
            {etcOn && (
              <input
                type="text"
                id="f-course-etc"
                className="lg-etc-input"
                aria-label={`${config.etcLabel} 과정명`}
                placeholder={config.etcPlaceholder}
                maxLength={config.etcMax}
                value={etcText}
                onChange={(e) => onEtcText(e.target.value)}
              />
            )}
          </label>
        </div>
        {error && (
          <span className="err" aria-live="polite" style={{ display: 'block' }}>
            {error === 'etc' ? config.errEtc : config.errRequired}
          </span>
        )}
      </fieldset>
    </div>
  );
}
