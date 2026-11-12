'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/cakery/header';
import { Footer } from '@/components/cakery/sections';

export function SiteShell({
  children,
  schemaJson,
  year,
}: {
  children: React.ReactNode;
  schemaJson: string;
  year: number;
}) {
  const pathname = usePathname();
  const isStandalonePreview =
    pathname === '/cake-order-preview' || pathname.startsWith('/cake-order-preview/');

  if (isStandalonePreview) {
    return <>{children}</>;
  }

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      {children}
      <Footer year={year} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </>
  );
}
