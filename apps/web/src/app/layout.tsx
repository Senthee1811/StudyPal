import './globals.css';
import { AppShell } from '../components/layout/AppShell';
import { LanguageProvider } from '../context/language-context';
import { AuthProvider } from '../context/auth-context';

export const metadata = {
  title: 'StudyPal — Multilingual AI Learning Platform for Sri Lanka',
  description:
    'AI-powered national curriculum learning platform supporting Sinhala, Tamil, and English for Grade 6-13 students. Upload PDFs, chat with documents, practise exams, and track mastery.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream-paper text-forest-ink">
        <LanguageProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
