import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { Dispatch, SetStateAction } from 'react'
import Container from 'react-bootstrap/esm/Container'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Card, CardSide } from '../types/card'
import { Unit } from '../types/mpc'
import { remove, reorder, replace } from '../util'
import ImageItem from './ImageItem'

interface ImageListProps {
  unit?: Unit
  files: CardSide[]
  cards: Card[]
  setCards: Dispatch<SetStateAction<Card[]>>
}

const ImageList = ({ unit, files, cards, setCards }: ImageListProps) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    setCards(prevState => reorder(
      prevState,
      result.source.index,
      result.destination!.index
    ))
  }

  const onItemChange = (index: number, item: Card) => {
    setCards(prevState => replace(prevState, index, item))
  }

  const onItemRemove = (index: number) => {
    setCards(prevState => remove(prevState, index))
  }

  return (
    <Container className='flex-fill overflow-scroll p-0'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <ListGroup
              {...provided.droppableProps}
              ref={provided.innerRef}
              as='ol'
            >
              {cards.map((card, index) => <ImageItem
                key={card.id}
                item={card}
                files={files}
                unit={unit}
                index={index}
                onChange={onItemChange}
                onDelete={onItemRemove}
              />)}
              {provided.placeholder}
            </ListGroup>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}

export default ImageList
