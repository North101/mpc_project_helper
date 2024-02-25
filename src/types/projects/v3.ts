import { Card } from "./v1"

export interface Part {
  code: string
  name: string
  cards: Card[]
}

export interface Project {
  version: 3
  parts: Part[]
}
