import { list, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilename } from "@/lib/utils";

// Cette liste doit refléter les dépôts les plus récents à chaque requête :
// sans cet indicateur, Next.js optimiserait ce handler GET (sans API dynamique)
// en réponse statique figée au moment du build.
export const dynamic = "force-dynamic";

const PREFIX = "reports/";
// Upload classique via le corps de cette fonction serverless : les Serverless
// Functions Vercel limitent ce corps à ~4,5 Mo, d'où une marge de sécurité à 4 Mo.
const MAX_SIZE = 4 * 1024 * 1024;

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

export async function POST(request: NextRequest) {
  const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  console.log(
    `[/api/reports POST] BLOB_READ_WRITE_TOKEN present=${hasToken}` +
      (hasToken ? ` length=${process.env.BLOB_READ_WRITE_TOKEN!.length}` : "")
  );

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json(
      { error: "Seuls les fichiers PDF sont acceptés." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse la taille maximale autorisée (4 Mo)." },
      { status: 400 }
    );
  }

  const filename = sanitizeFilename(file.name);

  let blob;
  try {
    blob = await put(`${PREFIX}${filename}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/pdf",
    });
  } catch (error) {
    console.error(
      "[/api/reports POST] put() failed:",
      error instanceof Error ? error.stack ?? error.message : error
    );
    return NextResponse.json(
      {
        error:
          "Le stockage des rapports (Vercel Blob) n'est pas configuré. Vérifiez la variable d'environnement BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    file: {
      name: blob.pathname.slice(PREFIX.length),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: blob.url,
    },
  });
}
