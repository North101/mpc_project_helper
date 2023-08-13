import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import ProgressBar from 'react-bootstrap/esm/ProgressBar'

interface ProgressModalProps {
  title: string
  value: number
  maxValue: number
  onClose: () => void
}

const ProgressModal = ({ title, value, maxValue, onClose }: ProgressModalProps) => (
  <Modal show centered>
    <Modal.Header>{title}</Modal.Header>
    <Modal.Body>
      <ProgressBar now={value} max={maxValue} />
      <div className='flex-fill justify-content-end'>
        {value} / {maxValue}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant='danger' onClick={onClose}>Cancel</Button>
    </Modal.Footer>
  </Modal>
)

export default ProgressModal
