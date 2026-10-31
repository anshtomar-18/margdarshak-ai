import React from 'react';
import './globals.css';
import { FloatingAiAssistant } from '@/components/FloatingAiAssistant';

export const metadata = {
  title: 'Margdarshak (मार्गदर्शक) — AI Career Counselling & Family Decision-Support (SIH26241)',
  description:
    'Evidence-grounded vocational career counselling and joint parent-learner decision support platform for MSDE (SIH 2026 Problem Statement SIH26241).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased">
        <div className="bg-accent-tint border-b border-accent px-4 py-2 text-xs text-center font-medium text-text-primary">
          ⚠️ <strong>Demonstration data, not official government figures.</strong> Every statistic displays its source & verification badge (Verified, Estimate, Illustrative, or Unavailable).
        </div>
        <main className="flex-1">{children}</main>
        <FloatingAiAssistant />
      </body>
    </html>
  );
}
