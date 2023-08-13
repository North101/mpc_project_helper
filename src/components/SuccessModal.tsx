import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import { ParsedProject } from '../types/project'
import ProjectLinkGroup from './ProjectLinkGroup'
import SaveProjectButton from './SaveProjectButton'

interface SuccessModalProps {
  projects: ParsedProject[]
  message?: string
  urls?: string[]
  onLoadProject?: (projects: ParsedProject[]) => void
  onClose: () => void
}

const SuccessModal = ({ projects, message, urls, onClose, onLoadProject }: SuccessModalProps) => (
  <Modal show centered scrollable>
    <Modal.Header>Success</Modal.Header>
    <Modal.Body>
      <div className='d-flex flex-column align-items-center overflow-scroll row-gap-2'>
        {message}
        {urls && <ProjectLinkGroup urls={urls} />}
        <SaveProjectButton projects={projects} />
      </div>
    </Modal.Body>
    <Modal.Footer>
      {onLoadProject && <Button variant='secondary' onClick={() => {
        onLoadProject(projects)
        onClose()
      }}>Load Project</Button>}
      <Button variant='danger' onClick={onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
)

export default SuccessModal
