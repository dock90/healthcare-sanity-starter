import { defineField, defineType } from "sanity";

/**
 * One link object for nav items, hero buttons and cards.
 * `href` is either a site path (`/services/cardiology`) or a full URL.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      description: "A site path like /services/cardiology or a full https:// URL.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || value.startsWith("/") || /^https:\/\//.test(value)
              ? true
              : "Must start with / (site path) or https://",
          ),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
