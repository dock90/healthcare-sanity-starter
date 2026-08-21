"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";
import { track } from "@/lib/track";

type Copy = { title: string; description: string; policyHref: string | null; policyLabel: string | null };

/**
 * The consent dialog. Non-modal so it never traps keyboard users on arrival;
 * it sits early in the DOM, has a name and description, and every control is
 * a real button or checkbox. Opens on first visit or when asked via
 * `openConsentDialog()`.
 */
export function ConsentGate({ copy }: { copy: Copy }) {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setOpen(true);
    const onOpen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setManage(true);
      setOpen(true);
      // Explicit reopen: move focus so keyboard users land in the dialog.
      window.setTimeout(() => headingRef.current?.focus(), 0);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function decide(choice: Pick<ConsentState, "analytics" | "marketing">) {
    writeConsent(choice);
    track("consent_update", { analytics: choice.analytics, marketing: choice.marketing });
    setOpen(false);
    setManage(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface p-5 shadow-[0_-4px_24px_rgb(27_27_26/0.08)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-lg sm:border"
    >
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-lg font-semibold">
        {copy.title}
      </h2>
      <p id={descId} className="mt-2 text-sm text-ink-muted">
        {copy.description}
        {copy.policyHref ? (
          <>
            {" "}
            <a href={copy.policyHref} className="text-accent-ink underline underline-offset-4">
              {copy.policyLabel ?? "Privacy policy"}
            </a>
          </>
        ) : null}
      </p>

      {manage ? (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Choose which cookies to allow</legend>
          <ConsentOption label="Necessary" description="Required for the site to work. Always on." checked disabled />
          <ConsentOption label="Analytics" description="Helps us understand which pages are useful. No health information is collected." checked={analytics} onChange={setAnalytics} />
          <ConsentOption label="Marketing" description="Lets us measure whether our outreach works." checked={marketing} onChange={setMarketing} />
        </fieldset>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {manage ? (
          <Button onClick={() => decide({ analytics, marketing })}>Save choices</Button>
        ) : (
          <>
            <Button onClick={() => decide({ analytics: true, marketing: true })}>Accept all</Button>
            <Button variant="secondary" onClick={() => decide({ analytics: false, marketing: false })}>Necessary only</Button>
            <Button variant="ghost" onClick={() => setManage(true)}>Manage</Button>
          </>
        )}
      </div>
    </div>
  );
}

function ConsentOption({ label, description, checked, disabled, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-5 w-5 shrink-0 accent-accent"
        checked={checked}
        disabled={disabled}
        aria-describedby={`${id}-desc`}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <label htmlFor={id} className="flex min-h-target flex-col justify-center">
        <span className="font-medium">{label}</span>
        <span id={`${id}-desc`} className="text-sm text-ink-muted">{description}</span>
      </label>
    </div>
  );
}
