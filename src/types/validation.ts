import * as validation from './validation.js'
import { ProjectV1, ProjectV2 } from './project.js'

export const projectV1Validator = (data: unknown): data is ProjectV1 =>
    (validation as any).projectV1Validator(data)
export const projectV2Validator = (data: unknown): data is ProjectV2 =>
    (validation as any).projectV2Validator(data)
