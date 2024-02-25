import { Card } from "./v1"

export interface Part {
  name: string
  cards: Card[]
}

export interface Project {
  version: 2
  code: string
  parts: Part[]
}
