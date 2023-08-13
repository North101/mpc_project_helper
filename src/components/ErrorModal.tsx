import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'

interface ErrorModalProps {
  error: unknown
  onClose: () => void
}

const ErrorModal = ({ error, onClose }: ErrorModalProps) => (
  <Modal show centered>
    <Modal.Header>Error</Modal.Header>
    <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
      {`${error}`}
    </Modal.Body>
    <Modal.Footer>
      <Button variant='secondary' onClick={onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
)

export default ErrorModal
