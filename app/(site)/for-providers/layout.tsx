import { SiteShell } from "@/components/layout/SiteShell";

export default function ProvidersLayout({ children }: LayoutProps<"/for-providers">) {
  return <SiteShell audience="providers">{children}</SiteShell>;
}
