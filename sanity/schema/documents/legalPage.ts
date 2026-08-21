import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { slugRule, slugify } from "../validation";

/** Privacy policy, terms, accessibility statement, notice of privacy practices. Routed at /legal/[slug]. */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required().max(90) }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", slugify },
      validation: slugRule,
    }),
    defineField({
      name: "effectiveDate",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", type: "portableText", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "effectiveDate" } },
});
