import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

export const providers = defineType({
  name: "providers",
  title: "Providers",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({
      name: "items",
      title: "Providers",
      type: "array",
      description: "Leave empty to list every provider, alphabetically.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "provider" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || (items?.length ? `${items.length} providers` : "All providers"),
      subtitle: "Providers",
    }),
  },
});
