import { list, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const PREFIX = "reports/";

function sanitizeFilename(name: string): string {
  const base = (name.split(/[\\/]/).pop() || "rapport.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}

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

  const MAX_SIZE = 25 * 1024 * 1024; // 25 Mo
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse la taille maximale autorisée (25 Mo)." },
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
  } catch {
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
