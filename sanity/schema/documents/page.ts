import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import { sectionTypeNames } from "../sections";
import { slugRule, slugify } from "../validation";

export const AUDIENCES = [
  { title: "Patients", value: "patients" },
  { title: "Providers", value: "providers" },
] as const;

export type Audience = (typeof AUDIENCES)[number]["value"];

/**
 * A page is an ordered list of sections under one audience.
 * Slug `home` is the audience root: `/` for patients, `/for-providers` for providers.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "audience",
      type: "string",
      group: "content",
      options: { list: [...AUDIENCES], layout: "radio", direction: "horizontal" },
      initialValue: "patients",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "Use 'home' for the audience's landing page.",
      options: { source: "title", slugify },
      validation: slugRule,
    }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: sectionTypeNames.map((name) => defineArrayMember({ type: name })),
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", audience: "audience", slug: "slug.current" },
    prepare: ({ title, audience, slug }) => ({
      title,
      subtitle: `${audience === "providers" ? "/for-providers" : ""}/${slug === "home" ? "" : slug ?? ""}`,
    }),
  },
});
