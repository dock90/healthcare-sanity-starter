"use client";

import { useActionState, useId, useState } from "react";
import { stegaClean } from "next-sanity";
import { Button, Container, Heading, Text } from "@/components/ui";
import { submitForm, type FormState } from "@/lib/form-action";
import { track } from "@/lib/track";
import { cx } from "@/lib/cx";
import { Turnstile } from "./Turnstile";
import type { SectionOf } from "./types";

const initial: FormState = { status: "idle" };
const inputClass =
  "block w-full min-h-target rounded border border-border-strong bg-surface px-3 py-2 text-base text-ink placeholder:text-ink-muted aria-[invalid=true]:border-error";

/**
 * The one form. Fields come from the CMS; the server action validates them
 * against the same spec and forwards to FORM_WEBHOOK_URL.
 */
export function Form({ section }: { section: SectionOf<"form"> }) {
  const [resetKey, setResetKey] = useState(0);
  const id = `form-${section._key}`;
  const hpId = useId();
  const formId = stegaClean(section.formId) ?? "";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const next = await submitForm(prev, formData);
    if (next.status === "success" || next.status === "error") {
      track("form_submit", { formId, outcome: next.status });
      // Turnstile tokens are single-use; get a fresh one for the retry.
      if (next.status === "error") setResetKey((k) => k + 1);
    }
    return next;
  }, initial);

  return (
    <section aria-labelledby={id} className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-prose">
          <Heading level={2} id={id}>{section.heading}</Heading>
          {section.text ? <Text muted className="mt-3">{section.text}</Text> : null}

          {state.status === "success" ? (
            <div role="status" className="mt-8 rounded-lg border border-success bg-surface p-5">
              <p className="font-medium text-success">Message sent</p>
              <Text className="mt-1">{section.successMessage}</Text>
            </div>
          ) : (
            <form action={action} noValidate className="mt-8 space-y-5">
              <input type="hidden" name="formId" value={formId} />

              {state.status === "error" && state.message ? (
                <div role="alert" className="rounded-lg border border-error bg-surface p-4 text-error">
                  {state.message}
                </div>
              ) : null}

              {section.fields?.map((field) => {
                const key = stegaClean(field.key) ?? field._key;
                const type = stegaClean(field.type) ?? "text";
                const fieldId = `${id}-${key}`;
                const error = state.fieldErrors?.[key];
                const describedBy = error ? `${fieldId}-error` : undefined;
                const common = {
                  id: fieldId,
                  name: key,
                  required: Boolean(field.required),
                  "aria-required": field.required ? true : undefined,
                  "aria-invalid": error ? true : undefined,
                  "aria-describedby": describedBy,
                  className: inputClass,
                };
                return (
                  <div key={field._key}>
                    <label htmlFor={fieldId} className="mb-1.5 block font-medium">
                      {field.label}
                      {field.required ? <span aria-hidden="true" className="text-error"> *</span> : null}
                    </label>
                    {type === "textarea" ? (
                      <textarea {...common} rows={5} maxLength={2000} />
                    ) : type === "select" ? (
                      <select {...common} defaultValue="">
                        <option value="" disabled>Choose one</option>
                        {field.options?.map((o) => (
                          <option key={o} value={stegaClean(o)}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        {...common}
                        type={type}
                        maxLength={200}
                        autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : key === "name" || key === "fullName" ? "name" : undefined}
                        inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
                      />
                    )}
                    {error ? (
                      <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-error">{error}</p>
                    ) : null}
                  </div>
                );
              })}

              {/* Honeypot: hidden from people, tempting to bots. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor={hpId}>Leave this field empty</label>
                <input id={hpId} type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {siteKey ? <Turnstile siteKey={siteKey} resetKey={resetKey} /> : null}

              <Button type="submit" disabled={pending} className={cx(pending && "opacity-70")}>
                {pending ? "Sending…" : section.submitLabel || "Send"}
              </Button>
              <Text size="sm" muted>
                Please don&apos;t include medical details, dates of birth, or insurance numbers. We&apos;ll collect anything clinical over the phone or through the patient portal.
              </Text>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
