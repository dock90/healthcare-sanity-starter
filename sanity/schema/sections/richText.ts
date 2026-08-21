import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons/Text";

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "body",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { blocks: "body" },
    prepare: ({ blocks }) => {
      const block = (blocks ?? []).find((b: { _type: string }) => b._type === "block");
      const text = block?.children?.map((c: { text: string }) => c.text).join("") ?? "";
      return { title: text.slice(0, 80) || "Empty", subtitle: "Rich text" };
    },
  },
});
