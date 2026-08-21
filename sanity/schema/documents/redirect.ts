import { defineField, defineType } from "sanity";
import { ArrowRightIcon } from "@sanity/icons/ArrowRight";

/** Compiled into next.config redirects at build time. See docs/MIGRATION.md. */
export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: "from",
      type: "string",
      description: "Old path, starting with /. Exact match, no wildcards.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^\/[^\s?#]*$/, { name: "path" })
          .error("Must be a path starting with /, without query string or hash"),
    }),
    defineField({
      name: "to",
      type: "string",
      description: "New path starting with /, or a full https:// URL.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || /^\/[^\s]*$/.test(value) || /^https:\/\/\S+$/.test(value)
              ? true
              : "Must be a path starting with / or an https:// URL",
          ),
    }),
    defineField({
      name: "permanent",
      type: "boolean",
      description: "308 (permanent, cached by browsers) vs 307 (temporary). Use permanent for migrations.",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { from: "from", to: "to", permanent: "permanent" },
    prepare: ({ from, to, permanent }) => ({
      title: `${from} → ${to}`,
      subtitle: permanent ? "308 permanent" : "307 temporary",
    }),
  },
});
