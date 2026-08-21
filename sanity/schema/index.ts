import type { SchemaTypeDefinition } from "sanity";
import { documentTypes } from "./documents";
import { imageWithAlt } from "./objects/imageWithAlt";
import { link } from "./objects/link";
import { portableText } from "./objects/portableText";
import { seo } from "./objects/seo";
import { sectionTypes } from "./sections";

export const schemaTypes: SchemaTypeDefinition[] = [
  ...documentTypes,
  ...sectionTypes,
  imageWithAlt,
  link,
  portableText,
  seo,
];
