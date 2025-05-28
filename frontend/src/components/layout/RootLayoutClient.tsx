'use client';

import { Header } from './Header';
import { FooterWrapper } from './FooterWrapper';

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '80px' }}>
        {children}
      </main>
      <FooterWrapper />
    </>
  );
} 