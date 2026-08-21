import { SiteShell } from "@/components/layout/SiteShell";

export default function PatientsLayout({ children }: LayoutProps<"/">) {
  return <SiteShell audience="patients">{children}</SiteShell>;
}
