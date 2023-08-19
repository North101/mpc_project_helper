import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { Dispatch, SetStateAction } from 'react'
import Container from 'react-bootstrap/esm/Container'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import { reorder } from '../util'
import ProjectItem from './ProjectItem'

interface ProjectListProps {
  site: Site
  projects: ParsedProject[]
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
}

const ProjectList = ({ site, projects, setProjects }: ProjectListProps) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    setProjects(prevState => reorder(
      prevState,
      result.source.index,
      result.destination!.index
    ))
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
              {projects.map((project, index) => <ProjectItem
                key={project.id}
                site={site}
                project={project}
                index={index}
                setProjects={setProjects}
              />)}
              {provided.placeholder}
            </ListGroup>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}

export default ProjectList
