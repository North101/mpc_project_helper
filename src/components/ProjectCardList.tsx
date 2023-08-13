import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { ParsedProject, ProjectCard } from '../types/project'
import { remove, reorder, replace } from '../util'
import ProjectCardItem from './ProjectCardItem'

interface ProjectCardListProps {
  project: ParsedProject
  onChange: (project: ParsedProject) => void
}

const ProjectCardList = ({ project, onChange }: ProjectCardListProps) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const cards = reorder(
      project.cards,
      result.source.index,
      result.destination.index
    )

    onChange({
      ...project,
      cards,
    })
  }

  const onItemChange = (index: number, item: ProjectCard) => {
    const cards = project.cards

    onChange({
      ...project,
      cards: replace(cards, index, item),
    })
  }

  const onItemRemove = (index: number) => {
    const cards = project.cards

    onChange({
      ...project,
      cards: remove(cards, index),
    })
  }

  return (
    <>
      <div className='flex-fill overflow-scroll'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={project.id}>
            {(provided) => (
              <ListGroup
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='flex-fill'
                as='ol'
              >
                {project.cards.map((item, index) => <ProjectCardItem
                  key={item.id}
                  item={item}
                  index={index}
                  onChange={onItemChange}
                  onDelete={onItemRemove}
                />)}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className='text-end'>
        Card Count: {project.cards.reduce((value, card) => value + card.count, 0)}
      </div>
    </>
  )
}

export default ProjectCardList
