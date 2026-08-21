import { defineArrayMember, defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { fieldKeyRule, phiWarning } from "../validation";

/**
 * The one form. Fields are declared here; the site renders them, a server
 * action forwards the submission to FORM_WEBHOOK_URL. Field keys that look
 * like PHI trigger a warning (see validation.ts).
 */
export const form = defineType({
  name: "form",
  title: "Form",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(90) }),
    defineField({
      name: "text",
      type: "text",
      rows: 2,
      description: "Shown above the form. Good place for: 'Do not include medical details.'",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "formId",
      title: "Form ID",
      type: "string",
      description: "Sent with every submission so your webhook can tell forms apart, e.g. contact, refer-a-patient.",
      validation: (rule) => fieldKeyRule(rule),
    }),
    defineField({
      name: "fields",
      type: "array",
      validation: (rule) => rule.required().min(1).max(10),
      of: [
        defineArrayMember({
          type: "object",
          name: "field",
          fields: [
            defineField({
              name: "key",
              type: "string",
              description: "Key in the submitted JSON. Avoid anything that collects health information.",
              validation: (rule) => [fieldKeyRule(rule), rule.custom((key) => phiWarning(key)).warning()],
            }),
            defineField({ name: "label", type: "string", validation: (rule) => rule.required().max(60) }),
            defineField({
              name: "type",
              type: "string",
              initialValue: "text",
              options: {
                list: [
                  { title: "Short text", value: "text" },
                  { title: "Email", value: "email" },
                  { title: "Phone", value: "tel" },
                  { title: "Long text", value: "textarea" },
                  { title: "Choice", value: "select" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "options",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              hidden: ({ parent }) => parent?.type !== "select",
              validation: (rule) =>
                rule.custom((options, context) => {
                  const parent = context.parent as { type?: string } | undefined;
                  if (parent?.type === "select" && (!options || options.length < 2)) {
                    return "A choice field needs at least two options";
                  }
                  return true;
                }),
            }),
            defineField({ name: "required", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { title: "label", subtitle: "key", required: "required" },
            prepare: ({ title, subtitle, required }) => ({
              title: `${title}${required ? " *" : ""}`,
              subtitle,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "submitLabel",
      type: "string",
      initialValue: "Send",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "successMessage",
      type: "text",
      rows: 2,
      initialValue: "Thanks, we've received your message and will be in touch within two business days.",
      validation: (rule) => rule.required().max(300),
    }),
  ],
  preview: {
    select: { title: "heading", fields: "fields" },
    prepare: ({ title, fields }) => ({ title, subtitle: `Form · ${fields?.length ?? 0} fields` }),
  },
});
