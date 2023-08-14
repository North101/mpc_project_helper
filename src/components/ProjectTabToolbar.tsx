import { Settings, createAutoSplitProject } from 'mpc_api'
import { Dispatch, SetStateAction, useRef } from 'react'
import { ArrowsCollapse, FileEarmarkPlus, Save, Upload, XCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Stack from 'react-bootstrap/esm/Stack'
import { v4 as uuid } from 'uuid'
import { Site, Unit } from '../types/mpc'
import { ParsedProject } from '../types/project'
import { projectValidator } from '../types/validation.ts'
import ErrorModal from './ErrorModal.tsx'
import LoadingModal from './LoadingModal.tsx'
import ProjectCombineModal from './ProjectCombineModal'
import ProjectSettingsModal from './ProjectSettingsModal'
import SuccessModal from './SuccessModal.tsx'

interface AddButtonProps {
  onClick: Dispatch<SetStateAction<ParsedProject[]>>
}

const AddButton = ({ onClick }: AddButtonProps) => {
  const ref = useRef<HTMLInputElement>(null)

  const onOpenFiles = () => ref?.current?.click()

  const onAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      try {
        const data = JSON.parse(await file.text())
        if (!projectValidator(data)) continue

        if (data.version == 1) {
          onClick(prevState => [
            ...prevState,
            {
              id: uuid(),
              code: data.code,
              name: file.name.substring(0, file.name.lastIndexOf('.')),
              cards: data.cards.map((card) => ({
                id: uuid(),
                ...card,
              })),
            },
          ])
        } else if (data.version == 2) {
          onClick(prevState => [
            ...prevState,
            ...data.parts.map(e => ({
              id: uuid(),
              code: data.code,
              name: e.name,
              cards: e.cards.map((card) => ({
                id: uuid(),
                ...card,
              })),
            })),
          ])
        }
      } catch (e) {
        console.log(e)
      }
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
  unit?: Unit
  projects: ParsedProject[]
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
  setModal: Dispatch<SetStateAction<JSX.Element | undefined>>
  clearModal: () => void
}

const ProjectTabToolbar = ({ site, unit, projects, setProjects, setModal, clearModal }: ProjectTabToolbarProps) => {
  const onClearProjects = () => setProjects([])

  const onCombine = () => setModal(<ProjectCombineModal
    projects={projects}
    setProjects={setProjects}
    onClose={clearModal}
  />)

  const onExport = () => setModal(<SuccessModal
    projects={projects}
    onClose={clearModal}
  />)

  const upload = async (settings: Settings, projects: ParsedProject[]) => {
    setModal(<LoadingModal
      onClose={clearModal}
    />)

    try {
      const cards = projects.flatMap(e => e.cards)
      setModal(<SuccessModal
        message='Your project(s) were successfully uploaded'
        projects={projects}
        urls={await createAutoSplitProject(settings, cards)}
        onClose={clearModal}
      />)
    } catch (e) {
      setModal(<ErrorModal
        error={e}
        onClose={clearModal}
      />)
      return
    }
  }

  const onUpload = () => setModal(<ProjectSettingsModal
    site={site}
    unit={unit!}
    projects={projects}
    onUpload={upload}
    onClose={clearModal}
  />)

  return (
    <Stack direction='horizontal' gap={1}>
      <AddButton onClick={setProjects} />
      <ClearButton onClick={onClearProjects} />
      <div className='flex-fill' />
      <Button variant='outline-primary' disabled={unit == undefined} onClick={onCombine}>
        <ArrowsCollapse /> Combine
      </Button>
      <Button variant='outline-primary' disabled={unit == undefined} onClick={onExport}>
        <Save /> Export
      </Button>
      <Button variant='outline-primary' disabled={unit == undefined} onClick={onUpload}>
        <Upload /> Upload
      </Button>
    </Stack>
  )
}

export default ProjectTabToolbar
