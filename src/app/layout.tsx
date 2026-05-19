import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrthoBelt — Find Out If the SI Joint Is Causing Your Back Pain",
  description:
    "Take the free 60-second quiz to discover the root cause of your back pain and unlock an exclusive discount on OrthoBelt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17534715252"
        ></Script>
        <Script id="gtag-config">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17534715252', {'allow_enhanced_conversions': true});
          `}
        </Script>
        <title>
          OrthoBelt — Find Out If the SI Joint Is Causing Your Back Pain
        </title>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
