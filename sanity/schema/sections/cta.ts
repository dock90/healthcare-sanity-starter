import { defineArrayMember, defineField, defineType } from "sanity";
import { BoltIcon } from "@sanity/icons/Bolt";

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  icon: BoltIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({ name: "text", type: "text", rows: 2, validation: (rule) => rule.max(240) }),
    defineField({
      name: "buttons",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(1).max(2),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Call to action" }),
  },
});
