import { UploadedImage as Card, Settings } from 'mpc_api'
export type { UploadedImage as Card, CompressedImageData as CardFace } from 'mpc_api'

export interface ProjectCard extends Card {
  id: string
}

export interface ParsedProject {
  id: string
  code: string
  name: string
  cards: ProjectCard[]
}
