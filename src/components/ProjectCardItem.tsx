import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, Trash } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { ProjectCard } from '../types/project'

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  userSelect: 'none',
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  gap: 4,

  ...draggableStyle,
})

interface ProjectCardItemProps {
  index: number
  item: ProjectCard
  onChange: (index: number, item: ProjectCard) => void
  onDelete: (index: number) => void
}

const ProjectCardItem = ({ index, item, onChange, onDelete }: ProjectCardItemProps) => {
  const onFrontChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!item.front) return

    onChange(index, {
      ...item,
      front: {
        ...item.front,
        Name: event.currentTarget.value,
      },
    })
  }

  const onBackChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!item.back) return

    onChange(index, {
      ...item,
      back: {
        ...item.back,
        Name: event.currentTarget.value,
      },
    })
  }

  const onCountChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.currentTarget.value)
    if (isNaN(value)) return

    onChange(index, {
      ...item,
      count: value,
    })
  }

  return (
    <Draggable draggableId={`${item.id}`} index={index}>
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
          <FloatingLabel controlId='floatingSelect1' label='Front' className='flex-fill'>
            <Form.Control
              aria-label='Front'
              value={item.front?.Name ?? item.front?.ID}
              onChange={onFrontChange}
              disabled={!item.front}
            />
          </FloatingLabel>
          <FloatingLabel controlId='floatingSelect2' label='Back' className='flex-fill'>
            <Form.Control
              aria-label='Back'
              value={item.back?.Name ?? item.back?.ID}
              onChange={onBackChange}
              disabled={!item.back}
            />
          </FloatingLabel>
          <FloatingLabel controlId='floatingCount' label='Count' style={{ width: 80 }}>
            <Form.Control
              required
              type='number'
              placeholder='Count'
              value={item.count}
              onChange={onCountChange}
            />
          </FloatingLabel>
          <Button variant='outline-primary' onClick={() => onDelete(index)}>
            <Trash />
          </Button>
        </ListGroup.Item>
      )}
    </Draggable>
  )
}

export default ProjectCardItem
