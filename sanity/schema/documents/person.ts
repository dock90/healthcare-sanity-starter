import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

/** Authors and medical reviewers. Not routed — there is no /people/[slug]. */
export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "credentials", type: "string", description: "e.g. MD, RN, MPH", validation: (rule) => rule.max(40) }),
    defineField({
      name: "role",
      type: "string",
      description: "e.g. Chief Medical Officer, Content Lead",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({ name: "headshot", type: "imageWithAlt" }),
    defineField({ name: "bio", type: "text", rows: 4, validation: (rule) => rule.required().max(600) }),
  ],
  preview: {
    select: { name: "name", credentials: "credentials", role: "role", media: "headshot" },
    prepare: ({ name, credentials, role, media }) => ({
      title: credentials ? `${name}, ${credentials}` : name,
      subtitle: role,
      media,
    }),
  },
});
