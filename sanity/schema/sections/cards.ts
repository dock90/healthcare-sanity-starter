import { defineArrayMember, defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons/ThLarge";

export const cards = defineType({
  name: "cards",
  title: "Cards",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({ name: "intro", type: "text", rows: 2, validation: (rule) => rule.max(240) }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required().max(80) }),
            defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.max(240) }),
            defineField({ name: "image", type: "imageWithAlt" }),
            defineField({ name: "link", type: "link" }),
          ],
          preview: { select: { title: "title", subtitle: "text", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || `${items?.length ?? 0} cards`,
      subtitle: "Cards",
    }),
  },
});
