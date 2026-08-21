import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockElementIcon } from "@sanity/icons/BlockElement";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "Short label above the heading, e.g. 'Now accepting new patients'.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "buttons",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({ title, subtitle: "Hero", media }),
  },
});
