"use client"

import { useState } from "react"
import type { Announcement as AnnouncementData } from "./types"
import { AnnouncementCard } from "./AnnouncementCard"
import { AnnouncementSheet } from "./AnnouncementSheet"
import { AnnouncementImageViewer } from "./AnnouncementImageViewer"

type AnnouncementProps = {
  announcement: AnnouncementData
  onViewAllClick?: () => void
}

export function Announcement({ announcement, onViewAllClick }: AnnouncementProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <>
      {!isSheetOpen && <AnnouncementCard announcement={announcement} onOpen={() => setIsSheetOpen(true)} />}

      {isSheetOpen && (
        <AnnouncementSheet
          announcement={announcement}
          activeImageIndex={activeImageIndex}
          onActiveImageIndexChange={setActiveImageIndex}
          onImageClick={(index) => {
            setActiveImageIndex(index)
            setIsViewerOpen(true)
          }}
          onClose={() => setIsSheetOpen(false)}
          onViewAllClick={onViewAllClick}
        />
      )}

      {isViewerOpen && (
        <AnnouncementImageViewer
          images={announcement.images}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  )
}
