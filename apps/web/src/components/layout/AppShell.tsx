'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // On landing page (root '/' or '/landing'): no sidebar, full-width canvas
  const isLandingPage = pathname === '/' || pathname === '/landing';

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#4b4b4b] selection:bg-[#d7ffb8] selection:text-[#1a3300]">
        <Navbar variant="landing" />
        <main className="flex-1 w-full bg-white">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-paper text-forest-ink">
      <Navbar variant="app" />
      <div className="flex-1 flex max-w-layout w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
