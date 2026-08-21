import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

const navGroup = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true },
    fields: [
      defineField({
        name: "header",
        title: "Header links",
        type: "array",
        of: [defineArrayMember({ type: "link" })],
        validation: (rule) => rule.max(6),
      }),
      defineField({
        name: "footer",
        title: "Footer links",
        type: "array",
        of: [defineArrayMember({ type: "link" })],
        validation: (rule) => rule.max(12),
      }),
      defineField({
        name: "cta",
        title: "Header button",
        type: "link",
      }),
    ],
  });

/** Singleton. The Studio structure pins it to document ID `settings`. */
export const settings = defineType({
  name: "settings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "org", title: "Organization", default: true },
    { name: "nav", title: "Navigation" },
    { name: "seo", title: "SEO" },
    { name: "analytics", title: "Analytics & consent" },
  ],
  fields: [
    defineField({ name: "orgName", title: "Organization name", type: "string", group: "org", validation: (rule) => rule.required().max(80) }),
    defineField({
      name: "tagline",
      type: "string",
      group: "org",
      description: "Used in the footer and as the default meta title suffix.",
      validation: (rule) => rule.max(120),
    }),
    defineField({ name: "logo", type: "imageWithAlt", group: "org" }),
    defineField({
      name: "contact",
      type: "object",
      group: "org",
      fields: [
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string", validation: (rule) => rule.email() }),
        defineField({
          name: "primaryLocation",
          type: "reference",
          to: [{ type: "location" }],
          description: "Address used in Organization structured data.",
        }),
      ],
    }),
    defineField({
      name: "social",
      type: "array",
      group: "org",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
    navGroup("patientsNav", "Patients navigation"),
    navGroup("providersNav", "Providers navigation"),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ga4Id",
      title: "GA4 measurement ID",
      type: "string",
      group: "analytics",
      description: "G-XXXXXXXXXX. Loads only after a visitor accepts analytics cookies.",
      validation: (rule) => rule.regex(/^G-[A-Z0-9]{6,}$/, { name: "GA4 ID" }),
    }),
    defineField({
      name: "consent",
      type: "object",
      group: "analytics",
      fields: [
        defineField({ name: "title", type: "string", initialValue: "Cookies on this site", validation: (rule) => rule.required().max(60) }),
        defineField({
          name: "description",
          type: "text",
          rows: 3,
          initialValue:
            "We use necessary cookies to make the site work. With your permission we'd also like to use analytics cookies to understand how the site is used. We never use cookies to collect health information.",
          validation: (rule) => rule.required().max(400),
        }),
        defineField({
          name: "policyLink",
          type: "link",
          description: "Link to the privacy policy page.",
        }),
      ],
    }),
  ],
  preview: { select: { title: "orgName" }, prepare: ({ title }) => ({ title: title ?? "Site settings" }) },
});
