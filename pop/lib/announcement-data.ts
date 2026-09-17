import type { Announcement } from "@/components/announcement/types"

export const exampleAnnouncement: Announcement = {
  id: "2026-autumn",
  badge: "NEW",
  title: "2026 하반기 프로그램",
  description: "새로운 소식을 확인하세요.",
  images: [
    {
      src: "/images/announcement-01.png",
      alt: "2026 하반기 프로그램 안내 현장",
    },
    {
      src: "/images/announcement-02.png",
      alt: "프로그램 참여 학생들의 협업 모습",
    },
    {
      src: "/images/announcement-03.png",
      alt: "교육 프로그램 수업 모습",
    },
    {
      src: "/images/announcement-04.png",
      alt: "캠퍼스에서 이동하는 학생들",
    },
  ],
  pdf: {
    name: "프로그램 안내 PDF",
    description: "2026 하반기 안내서",
    size: "2.4 MB",
    url: "/pdf/2026-autumn.pdf",
  },
  relatedImages: [
    { src: "/images/announcement-01.png", alt: "관련 이미지 1" },
    { src: "/images/announcement-02.png", alt: "관련 이미지 2" },
    { src: "/images/announcement-03.png", alt: "관련 이미지 3" },
    { src: "/images/announcement-04.png", alt: "관련 이미지 4" },
  ],
}
