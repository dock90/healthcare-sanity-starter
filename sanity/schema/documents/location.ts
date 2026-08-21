import { defineArrayMember, defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";
import { slugRule, slugify } from "../validation";

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", slugify },
      validation: slugRule,
    }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({
      name: "address",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        defineField({ name: "street", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "city", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "region",
          title: "State / region",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "postalCode", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "country", type: "string", initialValue: "US", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({ name: "geo", title: "Map point", type: "geopoint" }),
    defineField({
      name: "phone",
      type: "string",
      description: "As it should be displayed. Dialable link is derived automatically.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "hoursRange",
          fields: [
            defineField({
              name: "days",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { list: DAYS.map((d) => ({ title: d, value: d })) },
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "opens",
              type: "string",
              description: "24h, e.g. 08:00",
              validation: (rule) => rule.required().regex(/^\d{2}:\d{2}$/, { name: "HH:MM" }),
            }),
            defineField({
              name: "closes",
              type: "string",
              description: "24h, e.g. 17:30",
              validation: (rule) => rule.required().regex(/^\d{2}:\d{2}$/, { name: "HH:MM" }),
            }),
          ],
          preview: {
            select: { days: "days", opens: "opens", closes: "closes" },
            prepare: ({ days, opens, closes }) => ({
              title: (days ?? []).map((d: string) => d.slice(0, 3)).join(", "),
              subtitle: `${opens}–${closes}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "providers",
      type: "array",
      description: "Leave empty to derive from each provider's locations.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "provider" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "name", city: "address.city", media: "image" },
    prepare: ({ title, city, media }) => ({ title, subtitle: city, media }),
  },
});
