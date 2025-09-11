import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Montessori Library System",
  description: "A beautiful, animated library management system designed for Montessori schools",
  manifest: "/manifest.json",
  themeColor: "#10B981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Montessori Library"
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Montessori Library" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </head>
      <body 
        className={cn(
          inter.className,
          "min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 antialiased"
        )}
      >
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Install PWA prompt will be handled by the browser */}
          <div id="install-prompt" className="hidden fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-emerald-200 p-4 z-50 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📱</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Install Library App</h3>
                <p className="text-sm text-gray-600">Add to your home screen for quick access</p>
              </div>
              <div className="flex gap-2">
                <button 
                  id="install-dismiss" 
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Later
                </button>
                <button 
                  id="install-accept" 
                  className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Install Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            let deferredPrompt;
            const installPrompt = document.getElementById('install-prompt');
            const installAccept = document.getElementById('install-accept');
            const installDismiss = document.getElementById('install-dismiss');

            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;
              if (installPrompt) {
                installPrompt.classList.remove('hidden');
              }
            });

            if (installAccept) {
              installAccept.addEventListener('click', async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  console.log('User choice:', outcome);
                  deferredPrompt = null;
                }
                if (installPrompt) {
                  installPrompt.classList.add('hidden');
                }
              });
            }

            if (installDismiss) {
              installDismiss.addEventListener('click', () => {
                if (installPrompt) {
                  installPrompt.classList.add('hidden');
                }
              });
            }

            // Hide prompt if app is already installed
            window.addEventListener('appinstalled', () => {
              console.log('PWA was installed');
              if (installPrompt) {
                installPrompt.classList.add('hidden');
              }
            });
          `
        }} />
      </body>
    </html>
  );
}