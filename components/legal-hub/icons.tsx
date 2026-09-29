/** 법정 허브 인라인 아이콘 — 1.5 stroke, 텍스트색 상속, 장식(aria-hidden) */
const P = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IcPlus = () => <svg {...P} width="18" height="18"><path d="M12 5v14M5 12h14" /></svg>;
export const IcCheck = () => <svg {...P} width="18" height="18" strokeWidth={2.25}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const IcExternal = () => <svg {...P} width="14" height="14"><path d="M9 5h10v10M19 5L6 18" /></svg>;
export const IcClose = () => <svg {...P} width="15" height="15" strokeWidth={2}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const IcChevL = () => <svg {...P} width="16" height="16"><path d="M15 6l-6 6 6 6" /></svg>;
export const IcChevR = () => <svg {...P} width="16" height="16"><path d="M9 6l6 6-6 6" /></svg>;
export const IcChevUp = () => <svg {...P} width="16" height="16"><path d="M6 15l6-6 6 6" /></svg>;
