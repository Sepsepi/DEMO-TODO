import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import HideNextJSIndicator from "./hide-nextjs-indicator";

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: "TodoBozo - Gamified Task Manager",
  description: "Level up your productivity with TodoBozo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={pressStart.variable}>
      <body className="antialiased">
        <HideNextJSIndicator />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
