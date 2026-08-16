import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AllowlistModalProvider } from "@/components/AllowlistModalContext";
import AllowlistModal from "@/components/AllowlistModal";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const siteUrl = "https://feralhood.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Feral Hood: Feral, Furry, On-Chain",
  description:
    "Feral Hood is a colony of feral little mushroom critters living on Robinhood. Join the allowlist before the hood fills up.",
  icons: {
    icon: "/feralhood-avatar.jpg",
    shortcut: "/feralhood-avatar.jpg",
    apple: "/feralhood-avatar.jpg",
  },
  openGraph: {
    title: "Feral Hood",
    description:
      "A colony of feral little mushroom critters, born on Robinhood.",
    images: ["/feralhood-banner.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feral Hood",
    description:
      "A colony of feral little mushroom critters, born on Robinhood.",
    images: ["/feralhood-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${nunito.variable} antialiased`}>
        <AllowlistModalProvider>
          {children}
          <AllowlistModal />
        </AllowlistModalProvider>
      </body>
    </html>
  );
}
