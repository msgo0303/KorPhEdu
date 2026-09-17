"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { AnnouncementImage } from "./types"

type AnnouncementCarouselProps = {
  images: AnnouncementImage[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onImageClick: (index: number) => void
}

const SWIPE_THRESHOLD = 40

export function AnnouncementCarousel({
  images,
  activeIndex,
  onActiveIndexChange,
  onImageClick,
}: AnnouncementCarouselProps) {
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  if (images.length === 0) return null

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, index))
    onActiveIndexChange(clamped)
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
    touchDeltaX.current = 0
    setIsDragging(true)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1)
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1)
    }
    touchStartX.current = null
    touchDeltaX.current = 0
    setIsDragging(false)
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-slate-100"
        style={{ aspectRatio: "4 / 3" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex h-full transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isDragging ? "duration-0" : ""
          }`}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <button
              key={image.src + index}
              type="button"
              onClick={() => onImageClick(index)}
              className="relative h-full w-full shrink-0"
              aria-label={`이미지 크게 보기: ${image.alt}`}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                crossOrigin="anonymous"
                className="size-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm transition-opacity disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm transition-opacity disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="이미지 페이지">
          {images.map((image, index) => (
            <button
              key={image.src + index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 이미지로 이동`}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                index === activeIndex ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
