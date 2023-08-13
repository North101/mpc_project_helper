import { Draggable } from '@hello-pangea/dnd'
import React from 'react'
import { CheckLg, ExclamationTriangle, GripVertical, Trash } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { Card, CardSide } from '../types/card'
import { Unit } from '../types/mpc'

interface ImageDetailsProps {
  cardSide?: CardSide
  unit?: Unit
  size: number
  goodColor: string
  badColor: string
}

const ImageDetails = ({ cardSide, unit, size, goodColor, badColor }: ImageDetailsProps) => {
  if (!cardSide || !unit) return null

  const { info } = cardSide
  const width = info.width >= (unit.width * unit.dpi / 100)
  const height = info.height >= (unit.height * unit.dpi / 100)
  const orientation = (unit.width > unit.height) == (info.width > info.height)

  return <OverlayTrigger
    placement='bottom'
    overlay={
      <Tooltip>
        Width: <span style={{ color: !width ? badColor : undefined }}>{info.width}</span> (min: {(unit.width * unit.dpi / 100)})<br />
        Height: <span style={{ color: !height ? badColor : undefined }}>{info.height}</span> (min: {(unit.height * unit.dpi / 100)})<br />
        Orientation: <span style={{ color: !orientation ? badColor : undefined }}>{info.width > info.height ? 'Landscape' : 'Portrait'}</span> ({unit.width > unit.height ? 'Landscape' : 'Portrait'})
      </Tooltip>
    }
  >
    {width && height && orientation ? (
      <CheckLg size={size} color={goodColor} className='align-self-center' />
    ) : (
      <ExclamationTriangle size={size} color={badColor} className='align-self-center' />
    )}
  </OverlayTrigger>
}

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

interface ImageItemProps {
  index: number
  item: Card
  files: CardSide[]
  unit?: Unit
  onChange: (index: number, item: Card) => void
  onDelete: (index: number) => void
}

const ImageItem = ({ index, item, files, unit, onChange, onDelete, }: ImageItemProps) => {
  const onFrontChange = (event: React.FormEvent<HTMLSelectElement>) => {
    onChange(index, {
      ...item,
      front: files.find(file => file.id === event.currentTarget.value),
    })
  }

  const onBackChange = (event: React.FormEvent<HTMLSelectElement>) => {
    onChange(index, {
      ...item,
      back: files.find(file => file.id === event.currentTarget.value),
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
    <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        <ListGroup.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
          )}
        >
          <GripVertical className='align-self-center' />
          <div className='align-self-center text-end p-2' style={{ minWidth: 30 }}>{index + 1}</div>
          <FloatingLabel controlId='floatingSelect1' label='Front' className='flex-fill'>
            <Form.Select aria-label='Front' value={item.front?.id} onChange={onFrontChange}>
              <option key={''} value=''>Empty</option>
              {files.map(cardSide => (
                <option key={cardSide.id} value={cardSide.id}>{cardSide.file.name}</option>)
              )}
            </Form.Select>
          </FloatingLabel>
          <ImageDetails cardSide={item.front} unit={unit} size={24} goodColor='green' badColor='red' />
          <FloatingLabel controlId='floatingSelect2' label='Back' className='flex-fill'>
            <Form.Select aria-label='Back' value={item.back?.id} onChange={onBackChange}>
              <option key={''} value=''>Empty</option>
              {files.map(cardSide => (
                <option key={cardSide.id} value={cardSide.id}>{cardSide.file.name}</option>)
              )}
            </Form.Select>
          </FloatingLabel>
          <ImageDetails cardSide={item.back} unit={unit} size={24} goodColor='green' badColor='red' />
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

export default ImageItem
