import type { StegaBranded } from "next-sanity";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

/** Section data as returned by `sanityFetch` (stega-branded strings; `_type`/`_key` stay plain). */
export type Page = StegaBranded<NonNullable<PAGE_QUERY_RESULT>>;
export type Section = NonNullable<Page["sections"]>[number];
export type SectionOf<T extends Section["_type"]> = Extract<Section, { _type: T }>;
