import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required().max(160) }),
    defineField({ name: "answer", type: "portableText", validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      type: "string",
      description: "Free text, used for grouping in the Studio. e.g. Appointments, Billing, Referrals",
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});
