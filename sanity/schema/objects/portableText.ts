import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The one rich-text configuration. Headings start at h2 because the page
 * already owns the h1. Links are validated. Images require alt text.
 */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "string",
                title: "Destination",
                validation: (rule) =>
                  rule
                    .required()
                    .custom((value) =>
                      !value || value.startsWith("/") || /^(https:\/\/|mailto:|tel:)/.test(value)
                        ? true
                        : "Must start with /, https://, mailto: or tel:",
                    ),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});
