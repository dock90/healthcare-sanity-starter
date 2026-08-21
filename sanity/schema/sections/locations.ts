import { defineArrayMember, defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";

export const locations = defineType({
  name: "locations",
  title: "Locations",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({
      name: "items",
      title: "Locations",
      type: "array",
      description: "Leave empty to list every location.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || (items?.length ? `${items.length} locations` : "All locations"),
      subtitle: "Locations",
    }),
  },
});
