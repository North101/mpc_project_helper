import * as validation from './validation.js'
import { ProjectV1, ProjectV2 } from './project.js'

export const projectValidator = (data: unknown): data is ProjectV1 | ProjectV2 =>
  (validation as any).projectValidator(data)
