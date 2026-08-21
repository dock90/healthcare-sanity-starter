import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { UsersIcon } from "@sanity/icons/Users";
import { ArrowRightIcon } from "@sanity/icons/ArrowRight";

export const SETTINGS_ID = "settings";

/**
 * Studio navigation, grouped by who edits what:
 *   Pages (by audience) · Clinical · Content · Site
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Patients")
                .child(
                  S.documentList()
                    .title("Patient pages")
                    .schemaType("page")
                    .filter('_type == "page" && audience == "patients"'),
                ),
              S.listItem()
                .title("Providers")
                .child(
                  S.documentList()
                    .title("Provider pages")
                    .schemaType("page")
                    .filter('_type == "page" && audience == "providers"'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Clinical")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("Clinical")
            .items([
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("provider").title("Providers"),
              S.documentTypeListItem("location").title("Locations"),
            ]),
        ),
      S.listItem()
        .title("Content")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("person").title("People"),
              S.documentTypeListItem("faq").title("FAQs"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Site")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site")
            .items([
              S.listItem()
                .title("Settings")
                .icon(CogIcon)
                .child(S.document().schemaType("settings").documentId(SETTINGS_ID)),
              S.documentTypeListItem("legalPage").title("Legal pages"),
              S.documentTypeListItem("redirect").title("Redirects").icon(ArrowRightIcon),
            ]),
        ),
    ]);
