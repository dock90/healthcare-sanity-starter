import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";
import { readToken } from "@/sanity/env";

/**
 * Entered from the Studio's Presentation tool. Validates the signed preview
 * URL, enables Draft Mode (cookie), and redirects to the requested path.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});
