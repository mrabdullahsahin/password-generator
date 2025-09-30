import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import en from "@/i18n/messages/en.json";
import LangSwitcher from "@/components/LangSwitcher";

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Client-only password, passphrase and PIN generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <header className="border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">PassGen</Link>
            <nav className="flex items-center gap-4 text-sm">
              <a href="#" className="opacity-50 pointer-events-none">Blog</a>
              <LangSwitcher />
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          <I18nProvider messages={en}>
            {children}
          </I18nProvider>
        </main>
        <footer className="border-t text-xs text-neutral-600">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
            <span>Offline-first, client-only</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
