import { UploadedImage } from 'mpc_api'
export interface ProjectCard extends UploadedImage {
  id: string
}

export interface ProjectV1 {
  version: number
  code: string
  cards: UploadedImage[]
}

export interface ProjectV2Part {
  name: string
  cards: UploadedImage[]
}

export interface ProjectV2 {
  version: number
  code: string
  parts: ProjectV2Part[]
}

export interface ParsedProject {
  id: string
  code: string
  name: string
  cards: ProjectCard[]
}
