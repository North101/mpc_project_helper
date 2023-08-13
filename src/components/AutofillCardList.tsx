import React from 'react'
import { Trash } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Card } from '../types/card'
import { remove, replace } from '../util'

interface AutofillCardItemProps {
  index: number
  item: Card
  onChange: (index: number, item: Card) => void
  onDelete: (index: number) => void
}

const AutofillCardItem = ({ index, item, onChange, onDelete }: AutofillCardItemProps) => {
  const onCountChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.currentTarget.value)
    if (isNaN(value)) return

    onChange(index, {
      ...item,
      count: value,
    })
  }

  return (
    <ListGroup.Item
      key={index}
      className='d-flex gap-2 p-8'
      style={{
        borderTopWidth: 1,
        borderRadius: 0,
      }}
      as='li'
    >
      <div className='align-self-center text-end p-2' style={{ minWidth: 30 }}>{index + 1}</div>
      <FloatingLabel controlId='floatingSelect1' label='Front' className='flex-fill'>
        <Form.Control value={item.front?.file.name ?? ''} disabled />
      </FloatingLabel>
      <FloatingLabel controlId='floatingSelect2' label='Back' className='flex-fill'>
        <Form.Control value={item.back?.file.name ?? ''} disabled />
      </FloatingLabel>
      <FloatingLabel controlId='floatingCount' label='Count' style={{ width: 80 }}>
        <Form.Control
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
  )
}

interface AutofillCardListProps {
  cards: Card[]
  onChange: (cards: Card[]) => void
}

const AutofillCardList = ({ cards, onChange }: AutofillCardListProps) => {
  const onItemChange = (index: number, item: Card) => {
    onChange(replace(cards, index, item))
  }

  const onItemRemove = (index: number) => {
    onChange(remove(cards, index))
  }

  return (
    <ListGroup as='ol' className='flex-fill'>
      {cards.map((card, index) => (
        <AutofillCardItem
          key={card.id}
          index={index}
          item={card}
          onChange={onItemChange}
          onDelete={onItemRemove}
        />
      ))}
    </ListGroup>
  )
}

export default AutofillCardList
