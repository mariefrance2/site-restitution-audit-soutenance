"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import type { UploadedFile } from "./ReportUpload";

export function ReportList({ files }: { files: UploadedFile[] }) {
  if (files.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-2 px-6 py-10 text-center">
        <FileText className="h-8 w-8 text-neutral-300" strokeWidth={1.5} />
        <p className="text-sm font-medium text-neutral-500">
          Aucun rapport déposé pour le moment.
        </p>
        <p className="text-xs text-neutral-400">
          Les rapports d&apos;audit, de Red Teaming et de remédiation apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {files.map((file, i) => (
        <motion.li
          key={file.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="card-surface card-surface-hover flex items-center gap-4 px-4 py-3.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-red/10">
            <FileText className="h-5 w-5 text-brand-red" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-red-darker">{file.name}</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {formatDate(file.uploadedAt)} · {formatBytes(file.size)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-neutral-500 transition-colors hover:border-brand-red/30 hover:text-brand-red"
              aria-label={`Visualiser ${file.name}`}
              title="Visualiser"
            >
              <Eye className="h-4 w-4" />
            </a>
            <a
              href={file.url}
              download
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-neutral-500 transition-colors hover:border-brand-red/30 hover:text-brand-red"
              aria-label={`Télécharger ${file.name}`}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
