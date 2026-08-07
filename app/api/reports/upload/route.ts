import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

const PREFIX = "reports/";
const MAX_SIZE = 25 * 1024 * 1024; // 25 Mo

// Émet le jeton client Vercel Blob pour un upload direct navigateur -> Blob Store,
// sans transiter par le corps de cette fonction serverless (limité à ~4,5 Mo sur Vercel).
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(PREFIX) || !pathname.toLowerCase().endsWith(".pdf")) {
          throw new Error("Chemin de dépôt invalide : seuls les fichiers PDF dans reports/ sont acceptés.");
        }

        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Le stockage des rapports (Vercel Blob) n'est pas configuré. Vérifiez la variable d'environnement BLOB_READ_WRITE_TOKEN.",
      },
      { status: 400 }
    );
  }
}
