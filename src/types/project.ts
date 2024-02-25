import { UploadedImage as Card, Settings } from 'mpc_api'
import { Unit } from './mpc'
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


export interface UploadProject {
  name: string
  unit: Unit
  cards: ProjectCard[]
}

export interface UploadProjectSettings {
  settings: Settings
  cards: ProjectCard[]
}
