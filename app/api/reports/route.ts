import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

// Cette liste doit refléter les dépôts les plus récents à chaque requête :
// sans cet indicateur, Next.js optimiserait ce handler GET (sans API dynamique)
// en réponse statique figée au moment du build.
export const dynamic = "force-dynamic";

const PREFIX = "reports/";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: PREFIX, mode: "expanded" });

    const files = blobs
      .filter((b) => b.pathname.toLowerCase().endsWith(".pdf"))
      .map((b) => ({
        name: b.pathname.slice(PREFIX.length),
        size: b.size,
        uploadedAt: b.uploadedAt.toISOString(),
        url: b.url,
      }))
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

    return NextResponse.json({ files });
  } catch {
    // Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN manquant) : liste vide plutôt qu'une erreur bloquante.
    return NextResponse.json({ files: [] });
  }
}
