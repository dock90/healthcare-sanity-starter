import { faq } from "./faq";
import { legalPage } from "./legalPage";
import { location } from "./location";
import { page } from "./page";
import { person } from "./person";
import { post } from "./post";
import { provider } from "./provider";
import { redirect } from "./redirect";
import { service } from "./service";
import { settings } from "./settings";

/** The 10 document types. That's the whole content model. */
export const documentTypes = [page, service, provider, location, post, person, faq, legalPage, redirect, settings];
