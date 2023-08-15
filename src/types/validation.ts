import * as validation from './validation.js'
import { ProjectUnion } from './project.js'

export const projectValidator = (data: unknown): data is ProjectUnion =>
  (validation as any).projectValidator(data)
