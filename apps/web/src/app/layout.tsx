import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { LanguageProvider } from '../context/language-context';
import { AuthProvider } from '../context/auth-context';

export const metadata = {
  title: 'StudyPal Sri Lanka - Multilingual AI Learning Platform',
  description:
    'AI-powered national curriculum learning platform supporting Sinhala, Tamil, and English for Grade 6-13 students.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1 flex max-w-7xl w-full mx-auto">
                <Sidebar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
