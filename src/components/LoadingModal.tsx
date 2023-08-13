import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import Spinner from 'react-bootstrap/esm/Spinner'

interface LoadingModalProps {
  onClose: () => void
}

const LoadingModal = ({ onClose }: LoadingModalProps) => (
  <Modal show centered>
    <Modal.Header>Uploading...</Modal.Header>
    <Modal.Body>
      <div className='d-flex flex-column align-items-center p-4'>
        <Spinner animation='border' role='status' />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant='danger' onClick={onClose}>Cancel</Button>
    </Modal.Footer>
  </Modal>
)

export default LoadingModal
