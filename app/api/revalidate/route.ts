import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * On-publish revalidation. Sanity → POST /api/revalidate (signed with
 * SANITY_REVALIDATE_SECRET). Marks the document type's cache tag stale.
 *
 * `SanityLive` already revalidates for visitors who are on the site when
 * content changes; this webhook covers the case where nobody is.
 *
 * Webhook setup (sanity.io/manage → API → Webhooks):
 *   URL:        https://<your-domain>/api/revalidate
 *   Trigger on: create, update, delete
 *   Projection: { _type }
 *   Secret:     same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (!body?._type) {
    return NextResponse.json({ message: "Missing _type" }, { status: 400 });
  }

  revalidateTag(body._type, "max");
  return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() });
}
