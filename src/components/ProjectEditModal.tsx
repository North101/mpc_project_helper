import { useState } from 'react'
import { PencilSquare, Save } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import Stack from 'react-bootstrap/esm/Stack'
import { ParsedProject } from '../types/project'
import ProjectCardList from './ProjectCardList'
import SuccessModal from './SuccessModal'
import { useModal } from './util'

interface ProjectEditModalProps {
  project: ParsedProject
  index: number
  onSave: (project: ParsedProject, index: number) => void
  onClose: () => void
}

const ProjectEditModal = ({ project: initialProject, index, onClose, onSave }: ProjectEditModalProps) => {
  const [project, setProject] = useState(initialProject)
  const [modal, setModal, clearModal] = useModal()

  const onExport = () => {
    setModal(<SuccessModal
      projects={[project]}
      onClose={clearModal}
    />)
  }

  const onChange = (project: ParsedProject) => setProject(project)

  return (
    <Modal show fullscreen centered onHide={onClose} className='mpc-project-helper-dialog'>
      <Modal.Header closeButton className='row-gap-2'>
        <PencilSquare /> {project.name}
      </Modal.Header>
      <Modal.Body className='d-flex flex-column row-gap-2'>
        <Stack direction='horizontal' gap={1}>
          <div className='flex-fill' />
          <Button variant='outline-primary' onClick={onExport}>
            <Save /> Export
          </Button>
        </Stack>
        <ProjectCardList
          project={project}
          onChange={onChange}
        />
        {modal}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={onClose}>Cancel</Button>
        <Button variant='success' onClick={() => onSave(project, index)}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectEditModal
