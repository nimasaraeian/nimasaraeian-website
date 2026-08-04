import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ManifestGuard from "./ManifestGuard";

const APP_URL = "https://nimasaraeian.vercel.app/nima-os";

export const metadata: Metadata = {
  metadataBase: new URL("https://nimasaraeian.vercel.app"),
  title: "Nima OS",
  description: "مرکز فرمان شخصی نیما برای کار، سلامت، پروژه‌ها و دستیار هوشمند",
  manifest: "/nima-os/manifest-v2.webmanifest",
  applicationName: "Nima OS",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: "Nima OS",
    description: "مرکز فرمان شخصی نیما",
    url: APP_URL,
    siteName: "Nima OS",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Nima OS",
    statusBarStyle: "black-translucent",
    startupImage: [],
  },
  icons: {
    icon: "/favicon.png?v=nima-os-2",
    apple: "/favicon.png?v=nima-os-2",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Nima OS",
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
  return (
    <>
      <ManifestGuard />
      {children}
    </>
  );
}
