"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type { Announcement } from "./types"
import { AnnouncementCarousel } from "./AnnouncementCarousel"
import { PdfAttachment } from "./PdfAttachment"
import { RelatedImages } from "./RelatedImages"

type AnnouncementSheetProps = {
  announcement: Announcement
  activeImageIndex: number
  onActiveImageIndexChange: (index: number) => void
  onImageClick: (index: number) => void
  onClose: () => void
  onViewAllClick?: () => void
}

export function AnnouncementSheet({
  announcement,
  activeImageIndex,
  onActiveImageIndexChange,
  onImageClick,
  onClose,
  onViewAllClick,
}: AnnouncementSheetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 10)
    closeButtonRef.current?.focus()
    document.body.style.overflow = "hidden"
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  const handleClose = () => {
    setIsVisible(false)
    window.setTimeout(onClose, 300)
  }

  if (typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        className={`absolute inset-0 bg-black backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
          isVisible ? "opacity-35" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-sheet-title"
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-white shadow-[0_-8px_40px_-4px_rgba(15,23,42,0.25)] transition-transform duration-[350ms] ease-out motion-reduce:transition-none sm:max-w-[480px] sm:rounded-3xl sm:bottom-6 sm:right-6 sm:left-auto sm:mx-0 sm:max-h-[85vh] ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between px-4 pt-3">
          <div className="flex flex-1 justify-center">
            <span className="h-1.5 w-10 rounded-full bg-slate-200" aria-hidden="true" />
          </div>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="공지사항 닫기"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}>
          <div className="pt-4 pb-5">
            {announcement.badge && (
              <span className="mb-2 inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
                {announcement.badge}
              </span>
            )}
            <h2 id="announcement-sheet-title" className="text-[22px] font-bold leading-tight text-slate-900">
              {announcement.title}
            </h2>
            {announcement.description && (
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">{announcement.description}</p>
            )}
          </div>

          <AnnouncementCarousel
            images={announcement.images}
            activeIndex={activeImageIndex}
            onActiveIndexChange={onActiveImageIndexChange}
            onImageClick={onImageClick}
          />

          {announcement.pdf && (
            <div className="mt-6">
              <PdfAttachment pdf={announcement.pdf} />
            </div>
          )}

          {announcement.relatedImages && announcement.relatedImages.length > 0 && (
            <div className="mt-6">
              <RelatedImages images={announcement.relatedImages} onSelect={onActiveImageIndexChange} />
            </div>
          )}

          <button
            type="button"
            onClick={onViewAllClick}
            className="mt-7 flex w-full items-center justify-center gap-1 text-[14px] font-semibold text-slate-500 transition-colors hover:text-slate-700"
          >
            전체 공지사항 보기
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
