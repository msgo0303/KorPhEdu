"use client"

import { ChevronRight, Download, FileText } from "lucide-react"
import type { AnnouncementPdf } from "./types"

type PdfAttachmentProps = {
  pdf: AnnouncementPdf
}

export function PdfAttachment({ pdf }: PdfAttachmentProps) {
  return (
    <div className="flex flex-col gap-3">
      <a
        href={pdf.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:bg-slate-50"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
          <FileText className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold text-slate-900">{pdf.name}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-500">
            {pdf.description && <span className="truncate">{pdf.description}</span>}
            {pdf.description && pdf.size && <span aria-hidden="true">·</span>}
            {pdf.size && <span className="shrink-0">{pdf.size}</span>}
          </span>
        </span>

        <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
      </a>

      <a
        href={pdf.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        <Download className="size-4" aria-hidden="true" />
        PDF 자료 보기
      </a>
    </div>
  )
}
