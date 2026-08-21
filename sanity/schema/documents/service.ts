import { defineArrayMember, defineField, defineType } from "sanity";
import { ActivityIcon } from "@sanity/icons/Activity";
import { slugRule, slugify } from "../validation";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: ActivityIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "review", title: "Medical review" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required().max(90) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", slugify },
      validation: slugRule,
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "One or two sentences. Used in cards and as the default meta description.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({ name: "image", type: "imageWithAlt", group: "content" }),
    defineField({ name: "body", type: "portableText", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "faqs",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "providers",
      title: "Related providers",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "provider" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "reviewedBy",
      type: "reference",
      to: [{ type: "person" }],
      group: "review",
      description: "The clinician who reviewed this content for accuracy. Shown as a byline and in structured data.",
    }),
    defineField({
      name: "reviewedAt",
      type: "date",
      group: "review",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { reviewedBy?: unknown } | undefined;
          if (doc?.reviewedBy && !value) return "Add the review date";
          return true;
        }),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});
