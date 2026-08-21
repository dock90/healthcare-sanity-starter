"use client";

import { openConsentDialog } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button type="button" onClick={openConsentDialog} className="inline-flex min-h-target items-center font-medium text-ink underline-offset-4 hover:text-accent-ink hover:underline">
      Cookie settings
    </button>
  );
}
