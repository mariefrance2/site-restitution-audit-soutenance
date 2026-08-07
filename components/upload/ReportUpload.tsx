"use client";

import { upload } from "@vercel/blob/client";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { sanitizeFilename } from "@/lib/utils";

export interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

const MAX_SIZE = 25 * 1024 * 1024; // 25 Mo

export function ReportUpload({
  onUploaded,
}: {
  onUploaded: (file: UploadedFile) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Seuls les fichiers PDF sont acceptés.");
        return;
      }

      if (file.size > MAX_SIZE) {
        setError("Le fichier dépasse la taille maximale autorisée (25 Mo).");
        return;
      }

      setIsUploading(true);
      try {
        // Upload direct navigateur -> Vercel Blob : le fichier ne transite pas par
        // notre fonction serverless, évitant la limite de ~4,5 Mo sur le corps des
        // requêtes des Serverless Functions Vercel.
        const blob = await upload(`reports/${sanitizeFilename(file.name)}`, file, {
          access: "public",
          handleUploadUrl: "/api/reports/upload",
        });

        onUploaded({
          name: blob.pathname.replace(/^reports\//, ""),
          size: file.size,
          uploadedAt: new Date().toISOString(),
          url: blob.url,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Échec de l'envoi du fichier.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`focus-ring flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 ${
          isDragging
            ? "border-brand-red bg-brand-red/5"
            : "border-black/15 bg-surface-card hover:border-brand-red/40 hover:bg-brand-red/[0.03]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
              <p className="text-sm font-medium text-neutral-600">Envoi en cours…</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10">
                <UploadCloud className="h-6 w-6 text-brand-red" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold text-brand-red-darker">
                Glissez-déposez un rapport PDF ici
              </p>
              <p className="text-xs text-neutral-500">
                ou cliquez pour parcourir vos fichiers · PDF uniquement · 25 Mo max
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-brand-red">
                <FileUp className="h-3.5 w-3.5" /> Sélectionner un fichier
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-3 text-sm font-medium text-criticality-critical" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
