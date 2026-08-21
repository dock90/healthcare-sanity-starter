import { defineField, defineType } from "sanity";
import { EditIcon } from "@sanity/icons/Edit";
import { slugRule, slugify } from "../validation";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: EditIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "review", title: "Medical review" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required().max(110) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", slugify },
      validation: slugRule,
    }),
    defineField({
      name: "publishedAt",
      type: "date",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({ name: "image", title: "Cover image", type: "imageWithAlt", group: "content" }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "person" }],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", type: "portableText", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "reviewedBy",
      type: "reference",
      to: [{ type: "person" }],
      group: "review",
      description:
        "Health content should be reviewed by a qualified clinician. Shown as a byline and in Article structured data.",
      validation: (rule) =>
        rule.warning("Posts without a medical reviewer are treated as lower-trust by search engines"),
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
  preview: {
    select: { title: "title", date: "publishedAt", media: "image" },
    prepare: ({ title, date, media }) => ({ title, subtitle: date, media }),
  },
});
