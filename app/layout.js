import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/Header";
import { AppProviders } from "@/components/AppProviders";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mentora",
  description: "AI powered career guidnance platform",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* header  */}
            <Header />
            {/* main  */}
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            {/* footer */}
            <footer className="bg-gray-900 text-gray-300 py-4 text-center">
              <p className="text-sm">
                Created with <span className="text-red-500">♥</span> by Abdul Wahab
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </footer>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
