import { defineField, defineType } from "sanity";

/**
 * The only image type in the schema. Alt text is required at the schema level
 * and at the component level (SanityImage's `alt` prop), so a missing
 * description can't ship by accident.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe what the image shows for people who can't see it. If the image is purely decorative, write \"decorative\".",
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt" },
  },
});
