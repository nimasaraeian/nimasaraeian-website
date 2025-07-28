// app/layout.tsx
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Removed Inter font import and usage. Times New Roman is set in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nimasaraeian.com'),
  title: 'Nima Saraeian | AI & Psychology',
  description: 'Official website of Nima Saraeian, AI-driven psychological researcher and founder of Selflyzer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
