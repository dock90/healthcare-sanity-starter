import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export const faqs = defineType({
  name: "faqs",
  title: "FAQs",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || `${items?.length ?? 0} questions`,
      subtitle: "FAQs",
    }),
  },
});
