import { UploadedImage as Card } from 'mpc_api'
export type { UploadedImage as Card, CompressedImageData as CardFace } from 'mpc_api'

export interface Part {
  name: string
  cards: Card[]
}

export interface ProjectV1 {
  version: 1
  code: string
  cards: Card[]
}

export interface ProjectV2 {
  version: 2
  code: string
  parts: Part[]
}

export interface ProjectMeta {
  projectId: string[]
  name: string
  description: string
  info?: string | null
  website?: string | null
  authors: string[]
  tags: string[]
  created: string
  updated: string
  hash: string
}

export interface PartMeta extends Part {
  enabled?: boolean
}

export interface ProjectV1Meta extends ProjectV1, ProjectMeta {

}

export interface ProjectV2Meta extends ProjectV2, ProjectMeta {
  parts: PartMeta[]
}

export interface PartInfo {
  name: string
  count: number
  enabled: boolean
}

export interface ProjectInfo {
  filename: string
  name: string
  description: string
  info: string | null
  website: string | null
  authors: string[]
  tags: string[]
  created: string
  updated: string
  sites: string[]
  parts: PartInfo[]
}

export interface ProjectCard extends Card {
  id: string
}

export interface ParsedProject {
  id: string
  code: string
  name: string
  cards: ProjectCard[]
}
