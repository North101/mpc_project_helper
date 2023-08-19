import { useEffect, useState } from 'react'
import Stack from 'react-bootstrap/esm/Stack'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import CardCount from './CardCount'
import ProjectList from './ProjectList'
import ProjectTabToolbar from './ProjectTabToolbar'
import { ModalContext, useModal } from './util'

interface ProjectTabProps {
  site: Site
  projects?: ParsedProject[]
}

const ProjectTab = ({ site, projects: initialProjects }: ProjectTabProps) => {
  const [projects, setProjects] = useState<ParsedProject[]>(() => initialProjects ?? [])
  const [modal, setModal, clearModal] = useModal()

  const unitCode = projects.reduce<string | undefined>((value, project) => {
    return value == project.code ? value : undefined
  }, projects[0]?.code)
  const unit = site.unitList.find(e => e.code == unitCode)
  const cardCount = projects.reduce((value, project) => {
    return value + project.cards.reduce((value, card) => value + card.count, 0)
  }, 0)

  useEffect(() => {
    if (!initialProjects) return

    setProjects(initialProjects ?? [])
  }, [initialProjects])

  return (
    <ModalContext.Provider value={[modal, setModal, clearModal]}>
      <Stack className='d-flex h-100' gap={2}>
        <ProjectTabToolbar
          site={site}
          unit={unit}
          projects={projects}
          setProjects={setProjects}
        />
        <ProjectList
          site={site}
          projects={projects}
          setProjects={setProjects}
        />
        <CardCount
          count={cardCount}
          unit={unit}
        />
        {modal}
      </Stack>
    </ModalContext.Provider>
  )
}

export default ProjectTab
