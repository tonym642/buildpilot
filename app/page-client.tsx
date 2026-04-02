"use client";

import dynamic from 'next/dynamic';

const PageApp = dynamic(() => import('./page-app'), { ssr: false });

export default function PageClient() {
  return <PageApp />;
}
