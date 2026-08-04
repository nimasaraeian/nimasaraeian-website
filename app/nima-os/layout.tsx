import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Nima OS",
  description: "مرکز فرمان شخصی نیما برای کار، سلامت، پروژه‌ها و دستیار هوشمند",
  manifest: "/nima-os/manifest.webmanifest",
  applicationName: "Nima OS",
  appleWebApp: {
    capable: true,
    title: "Nima OS",
    statusBarStyle: "black-translucent",
    startupImage: [],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07101f",
};

export default function NimaOSLayout({ children }: { children: ReactNode }) {
  return children;
}
