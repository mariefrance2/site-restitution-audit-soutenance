import { mkdir, readdir, stat, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");

async function ensureDir() {
  if (!existsSync(REPORTS_DIR)) {
    await mkdir(REPORTS_DIR, { recursive: true });
  }
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}

export async function GET() {
  await ensureDir();
  const entries = await readdir(REPORTS_DIR);
  const files = await Promise.all(
    entries
      .filter((name) => name.toLowerCase().endsWith(".pdf"))
      .map(async (name) => {
        const filePath = path.join(REPORTS_DIR, name);
        const info = await stat(filePath);
        return {
          name,
          size: info.size,
          uploadedAt: info.mtime.toISOString(),
          url: `/reports/${encodeURIComponent(name)}`,
        };
      })
  );

  files.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  return NextResponse.json({ files });
}

export async function POST(request: NextRequest) {
  await ensureDir();

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

  let filename = sanitizeFilename(file.name);
  let destination = path.join(REPORTS_DIR, filename);

  if (existsSync(destination)) {
    const ext = path.extname(filename);
    const stem = path.basename(filename, ext);
    filename = `${stem}-${Date.now()}${ext}`;
    destination = path.join(REPORTS_DIR, filename);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, buffer);

  const info = await stat(destination);

  return NextResponse.json({
    file: {
      name: filename,
      size: info.size,
      uploadedAt: info.mtime.toISOString(),
      url: `/reports/${encodeURIComponent(filename)}`,
    },
  });
}
