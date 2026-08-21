import { defineArrayMember, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";
import { slugRule, slugify } from "../validation";

export const provider = defineType({
  name: "provider",
  title: "Provider",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "As it should appear on the site, without credentials. e.g. Priya Raman",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "credentials",
      type: "string",
      description: "e.g. MD, FACC",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", slugify },
      validation: slugRule,
    }),
    defineField({
      name: "headshot",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Role",
      type: "string",
      description: "e.g. Cardiologist, Nurse Practitioner",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "specialties",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "acceptingPatients",
      title: "Accepting new patients",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "bio", type: "portableText", validation: (rule) => rule.required() }),
    defineField({
      name: "locations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { name: "name", credentials: "credentials", title: "title", media: "headshot" },
    prepare: ({ name, credentials, title, media }) => ({
      title: credentials ? `${name}, ${credentials}` : name,
      subtitle: title,
      media,
    }),
  },
});
