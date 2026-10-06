/**
 * 개인정보 수집·이용 동의문 '2. 수집 항목' 두 줄 (upgrade-04 D34). 폼의 필수 슬롯 설정에서 파생한다.
 * - 'position'(기본, 홈·/kium·/leadership·/hrd): 기존 문구와 한 글자도 다르지 않아야 한다 (회귀 0)
 * - 'trainees'(법정 허브 빠른 상담): 직급/직책을 수집하지 않고 예상 교육인원을 필수로 받는다
 * ※ 법정 폼 동의문 변형은 운영 이관 전 정보보호팀 확인 대상 (PRD upgrade-04 P1)
 */
export type RequiredSlot = 'position' | 'trainees';

export function consentItems(slot: RequiredSlot) {
  return slot === 'trainees'
    ? { req: '담당자명, 회사·기관명, 연락처, 이메일, 예상 교육인원',
        opt: '회사 규모(임직원 수), 관심 영역, 문의 내용, 첨부파일' }
    : { req: '담당자명, 회사·기관명, 직급/직책, 연락처, 이메일',
        opt: '회사 규모(임직원 수), 예상 교육인원, 관심 영역, 문의 내용, 첨부파일' };
}
