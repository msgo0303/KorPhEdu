"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { Announcement } from "./types"

type AnnouncementCardProps = {
  announcement: Announcement
  onOpen: () => void
}

export function AnnouncementCard({ announcement, onOpen }: AnnouncementCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const thumbnail = announcement.images[0]

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 50)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed inset-x-4 z-40 sm:inset-x-auto sm:right-6 sm:w-[380px]"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={`flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 text-left shadow-[0_8px_30px_-8px_rgba(15,23,42,0.15)] backdrop-blur-sm transition-all duration-300 ease-out motion-reduce:transition-none active:scale-[0.98] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <img
          src={thumbnail?.src || "/placeholder.svg"}
          alt=""
          crossOrigin="anonymous"
          className="size-13 shrink-0 rounded-xl object-cover"
          style={{ width: 52, height: 52 }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {announcement.badge && (
              <span className="inline-flex items-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {announcement.badge}
              </span>
            )}
            <p className="truncate text-[13px] font-bold text-slate-900">{announcement.title}</p>
          </div>
          {announcement.description && (
            <p className="mt-0.5 truncate text-[12px] font-medium text-slate-500">{announcement.description}</p>
          )}
        </div>

        <ChevronRight className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="sr-only">공지사항 자세히 보기</span>
      </button>
    </div>
  )
}
