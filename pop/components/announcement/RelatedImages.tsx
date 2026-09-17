"use client"

import type { AnnouncementImage } from "./types"

type RelatedImagesProps = {
  images: AnnouncementImage[]
  onSelect: (index: number) => void
}

export function RelatedImages({ images, onSelect }: RelatedImagesProps) {
  if (images.length === 0) return null

  return (
    <div>
      <p className="mb-2.5 text-[13px] font-semibold text-slate-700">관련 이미지</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={image.src + index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${index + 1}번째 이미지로 이동`}
            className="size-16 shrink-0 overflow-hidden rounded-[10px] border border-slate-200 transition-opacity active:opacity-70"
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              crossOrigin="anonymous"
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
