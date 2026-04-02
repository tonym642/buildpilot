"use client";
import dynamic from 'next/dynamic';

const Page = dynamic(() => import('./page-client'), { ssr: false });

export default function RootPage() {
  return <Page />;
}
