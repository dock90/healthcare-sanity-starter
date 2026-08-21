import { defineField, defineType } from "sanity";

/** Per-document SEO overrides. Everything falls back to the document's own title/summary. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Overrides the page title in search results. Leave blank to use the document title.",
      validation: (rule) => rule.max(70).warning("Titles over 70 characters get truncated"),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Descriptions over 160 characters get truncated"),
    }),
    defineField({
      name: "image",
      title: "Social image",
      type: "imageWithAlt",
      description: "1200×630 recommended. Falls back to the site default.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
