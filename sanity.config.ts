"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schema";
import { SETTINGS_ID, structure } from "./sanity/structure";

const SINGLETONS = new Set(["settings"]);

export default defineConfig({
  name: "default",
  title: "Healthcare Sanity Starter",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (prev) => prev.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    // Singletons can't be deleted, duplicated or unpublished.
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(({ action }) => action && !["delete", "duplicate", "unpublish"].includes(action))
        : prev,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
// Settings document ID is fixed so queries can fetch it by ID.
export { SETTINGS_ID };
