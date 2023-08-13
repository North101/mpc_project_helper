import { Draggable } from '@hello-pangea/dnd'
import { Dispatch, SetStateAction } from 'react'
import { GripVertical, PencilSquare, Trash } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import { remove, replace } from '../util'
import ProjectEditModal from './ProjectEditModal'


const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  userSelect: 'none',
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  gap: 4,

  ...draggableStyle,
})

interface ProjectItemProps {
  site: Site
  project: ParsedProject
  index: number
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
  setModal: Dispatch<SetStateAction<JSX.Element | undefined>>
  clearModal: () => void
}

const ProjectItem = ({ site, project, index, setProjects, setModal, clearModal }: ProjectItemProps) => {
  const unit = site.unitList.find(e => e.code == project.code)

  const onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.currentTarget.value
    setProjects(prevState => replace(prevState, index, {
      ...project,
      name,
    }))
  }

  const onSave = (project: ParsedProject, index: number) => {
    setProjects(prevState => replace(prevState, index, project))
    clearModal()
  }

  const onEdit = () => {
    setModal(<ProjectEditModal
      project={project}
      index={index}
      onSave={onSave}
      onClose={clearModal}
    />)
  }

  const onDelete = () => setProjects(prevState => remove(prevState, index))

  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <ListGroup.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
          )}
          as='li'
        >
          <GripVertical className='align-self-center' />
          <div className='align-self-center text-end p-2' style={{ minWidth: 30 }}>{index + 1}</div>
          <FloatingLabel controlId='floatingSelect1' label='Name' className='flex-fill'>
            <Form.Control
              type='text'
              placeholder='Name'
              value={project.name}
              onChange={onNameChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId='floatingSelect2' label='Product' className='flex-fill'>
            <Form.Control aria-label='Product' value={unit?.name ?? 'Unknown'} disabled />
          </FloatingLabel>
          <FloatingLabel controlId='floatingCount' label='Count' style={{ width: 80 }}>
            <Form.Control
              required
              type='number'
              placeholder='Count'
              value={project.cards.reduce((value, card) => value + card.count, 0)}
              disabled
            />
          </FloatingLabel>
          <Button variant='outline-primary' onClick={onEdit}>
            <PencilSquare />
          </Button>
          <Button variant='outline-primary' onClick={onDelete}>
            <Trash />
          </Button>
        </ListGroup.Item>
      )}
    </Draggable>
  )
}

export default ProjectItem
