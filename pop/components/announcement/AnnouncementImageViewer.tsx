"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { AnnouncementImage } from "./types"

type AnnouncementImageViewerProps = {
  images: AnnouncementImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onClose: () => void
}

const SWIPE_THRESHOLD = 40

export function AnnouncementImageViewer({
  images,
  activeIndex,
  onActiveIndexChange,
  onClose,
}: AnnouncementImageViewerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 10)
    closeButtonRef.current?.focus()
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
      if (event.key === "ArrowLeft") goTo(activeIndex - 1)
      if (event.key === "ArrowRight") goTo(activeIndex + 1)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, index))
    onActiveIndexChange(clamped)
  }

  const handleClose = () => {
    setIsVisible(false)
    window.setTimeout(onClose, 200)
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
    touchDeltaX.current = 0
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) goTo(activeIndex - 1)
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) goTo(activeIndex + 1)
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  const image = images[activeIndex]
  if (!image) return null

  if (typeof document === "undefined") return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="이미지 전체화면 보기"
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/90 transition-opacity duration-200 motion-reduce:transition-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          handleClose()
        }}
        aria-label="이미지 뷰어 닫기"
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80" style={{ top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}>
        {activeIndex + 1} / {images.length}
      </p>

      <div
        className="relative flex h-full w-full items-center justify-center px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          crossOrigin="anonymous"
          className="max-h-[80vh] max-w-full rounded-lg object-contain select-none"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                goTo(activeIndex - 1)
              }}
              disabled={activeIndex === 0}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-opacity disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                goTo(activeIndex + 1)
              }}
              disabled={activeIndex === images.length - 1}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-opacity disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
