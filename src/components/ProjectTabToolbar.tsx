import { createAutoSplitProject } from 'mpc_api'
import { Dispatch, SetStateAction, useContext, useRef } from 'react'
import { ArrowsCollapse, FileEarmarkPlus, Save, Upload, XCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Stack from 'react-bootstrap/esm/Stack'
import { v4 as uuid } from 'uuid'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import { validate } from '../types/projects'
import { ProjectUnion } from '../types/projects/union'
import ErrorModal from './ErrorModal'
import LoadingModal from './LoadingModal'
import ProjectCombineModal from './ProjectCombineModal'
import ProjectSettingsModal, { UploadProjectSettings } from './ProjectSettingsModal'
import SuccessModal from './SuccessModal'
import { ModalContext } from './util'

const parseProject = (filename: string, project: ProjectUnion): ParsedProject[] => {
  if (project.version == 1) {
    const { code, cards } = project
    return [{
      id: uuid(),
      code,
      name: filename,
      cards: cards.map(card => ({
        id: uuid(),
        ...card,
      })),
    }]
  } else if (project.version == 2) {
    const { code, parts } = project
    return parts.map(part => ({
      id: uuid(),
      code,
      name: part.name,
      cards: part.cards.map(card => ({
        id: uuid(),
        ...card,
      })),
    }))
  } else if (project.version == 3) {
    const { parts } = project
    return parts.map(part => ({
      id: uuid(),
      code: part.code,
      name: part.name,
      cards: part.cards.map(card => ({
        id: uuid(),
        ...card,
      })),
    }))
  }
  throw Error()
}

interface AddButtonProps {
  onClick: Dispatch<SetStateAction<ParsedProject[]>>
}

const AddButton = ({ onClick }: AddButtonProps) => {
  const [_, setModal, clearModal] = useContext(ModalContext)
  const ref = useRef<HTMLInputElement>(null)

  const onOpenFiles = () => ref?.current?.click()

  const onAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return

    const projects: ParsedProject[] = []
    const projectErrors: string[] = []
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      try {
        const data: unknown = JSON.parse(await file.text())
        if (validate(data)) {
          projects.push(...parseProject(file.name, data))
        } else {
          projectErrors.push(file.name)
        }
      } catch (e) {
        console.log(e)
        projectErrors.push(file.name)
      }
    }
    onClick(prevState => [
      ...prevState,
      ...projects,
    ])
    if (projectErrors.length > 0) {
      setModal(<ErrorModal
        error={projectErrors.map(e => `Failed to parse "${e}"`).join('\n')}
        onClose={clearModal}
      />)
    }
  }

  return (
    <>
      <input
        id='project-input'
        className='d-none'
        key={Date.now()}
        ref={ref}
        type='file'
        multiple
        accept='.txt, .json'
        onChange={onAdd}
      />
      <Button variant='outline-primary' onClick={onOpenFiles}>
        <FileEarmarkPlus /> Add projects
      </Button>
    </>
  )
}

interface ClearButtonProps {
  onClick: () => void
}

const ClearButton = ({ onClick }: ClearButtonProps) => (
  <Button variant='outline-primary' onClick={onClick}>
    <XCircle /> Clear
  </Button>
)

interface ProjectTabToolbarProps {
  site: Site
  projects: ParsedProject[]
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
}

const ProjectTabToolbar = ({ site, projects, setProjects }: ProjectTabToolbarProps) => {
  const [_, setModal, clearModal] = useContext(ModalContext)

  const onClearProjects = () => setProjects([])

  const onCombine = () => setModal(<ProjectCombineModal
    site={site}
    projects={projects}
    setProjects={setProjects}
    onClose={clearModal}
  />)

  const onExport = () => setModal(<SuccessModal
    projects={projects}
    onClose={clearModal}
  />)

  const upload = async (upload: UploadProjectSettings[]) => {
    const key = uuid()
    setModal(<LoadingModal
      key={key}
      onClose={clearModal}
    />)

    const urls: string[] = []
    try {
      for (const {cards, settings} of upload) {
        urls.push(...await createAutoSplitProject({
          ...settings,
          name: undefined,
        }, cards))
      }
      setModal(prevState => {
        if (prevState?.key != key) return prevState

        return <SuccessModal
          message='Your project(s) were successfully uploaded'
          projects={projects}
          urls={urls}
          onClose={clearModal}
        />
      })
    } catch (e) {
      setModal(prevState => {
        if (prevState?.key != key) return prevState

        return <ErrorModal
          error={e}
          onClose={clearModal}
        />
      })
      return
    }
  }

  const onUpload = () => setModal(<ProjectSettingsModal
    site={site}
    projects={projects}
    onUpload={upload}
    onClose={clearModal}
  />)

  return (
    <Stack direction='horizontal' gap={1}>
      <AddButton onClick={setProjects} />
      <ClearButton onClick={onClearProjects} />
      <div className='flex-fill' />
      <Button variant='outline-primary' onClick={onCombine}>
        <ArrowsCollapse /> Combine
      </Button>
      <Button variant='outline-primary' disabled={projects.length == 0} onClick={onExport}>
        <Save /> Export
      </Button>
      <Button variant='outline-primary' disabled={projects.length == 0} onClick={onUpload}>
        <Upload /> Upload
      </Button>
    </Stack>
  )
}

export default ProjectTabToolbar
