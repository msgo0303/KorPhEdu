export type AnnouncementImage = {
  src: string
  alt: string
}

export type AnnouncementPdf = {
  name: string
  description?: string
  size?: string
  url: string
}

export type Announcement = {
  id: string
  badge?: string
  title: string
  description?: string
  images: AnnouncementImage[]
  pdf?: AnnouncementPdf
  relatedImages?: AnnouncementImage[]
}
