import type { Metadata } from 'next';
import './globals.css';
import '@/styles/components.css';
import '@/styles/floating-inquiry.css';
import { pretendard, gowun } from './fonts';
import Footer from '@/components/common/Footer';
import ToTop from '@/components/common/ToTop';
import FloatingInquiry from '@/components/common/FloatingInquiry';
import HashFontFix from '@/components/common/HashFontFix';
import TeaserSnackbar from '@/components/common/TeaserSnackbar';

// OG 이미지(상대경로)의 절대 URL 해석 기준. 정본 도메인 미확정이라 값을 임의로 정하지 않고,
// Vercel이 빌드 시 주입하는 VERCEL_URL을 쓰고 로컬은 dev 포트로 폴백한다.
// 정본 도메인 확정 시 이 한 줄만 교체하면 된다.
const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'KEESS · KG에듀원 기업교육',
  description: '진단으로 설계하고, 효과로 증명합니다. KG에듀원 HRD사업본부 기업·기관 교육 도입 채널.',
  // 시안 저장소(law-b) 전용 — 검색 노출 차단. 운영 이관 시 제거
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // [F40 · 261007] suppressHydrationWarning: 홈 히어로 인라인 스크립트가 첫 페인트 전 <html data-hero-start>를
  //   붙인다(C안 첫 장 교차). 이 요소 자신의 속성 불일치 경고만 끄며 하위 트리 검사에는 영향 없다.
  return (
    <html lang="ko" className={`${pretendard.variable} ${gowun.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">본문 바로가기</a>
        {children}
        <Footer />
        <FloatingInquiry />
        <HashFontFix />
        <ToTop />
        <TeaserSnackbar />
      </body>
    </html>
  );
}
