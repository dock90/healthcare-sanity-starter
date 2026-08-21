import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/live";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Healthcare Sanity Starter",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {children}
        <SanityLive />
        {isDraft ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
