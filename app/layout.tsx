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
        {isDraft ? (
          <>
            <VisualEditing />
            {/* Plain anchor on purpose: <Link> would prefetch the route handler and end draft mode early. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/draft-mode/disable"
              className="fixed bottom-4 right-4 z-50 inline-flex min-h-target items-center rounded bg-ink px-4 text-sm font-medium text-ink-inverse"
            >
              Exit preview
            </a>
          </>
        ) : null}
      </body>
    </html>
  );
}
