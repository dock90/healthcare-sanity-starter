import { cards } from "./cards";
import { cta } from "./cta";
import { faqs } from "./faqs";
import { form } from "./form";
import { hero } from "./hero";
import { locations } from "./locations";
import { providers } from "./providers";
import { richText } from "./richText";

/** The 8 sections. Order here is the order in the Studio "add section" menu. */
export const sectionTypes = [hero, richText, cta, cards, faqs, providers, locations, form];
export const sectionTypeNames = sectionTypes.map((s) => s.name);
