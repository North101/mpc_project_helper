import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import React from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { ParsedProject, ProjectCard } from "../types/project";
import { remove, reorder, replace } from "../util";
import ProjectCardItem from "./ProjectCardItem";

interface ProjectCardListProps {
  project: ParsedProject;
  onChange: (project: ParsedProject) => void;
}

export default class ProjectCardList extends React.Component<ProjectCardListProps> {
  static itemId = 0;

  onChange = (project: ParsedProject) => {
    const { onChange } = this.props;

    onChange(project);
  }

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { project } = this.props;
    const cards = reorder(
      project.cards,
      result.source.index,
      result.destination.index
    );

    this.onChange({
      ...project,
      cards,
    });
  }

  onItemChange = (index: number, item: ProjectCard) => {
    const { project } = this.props;
    const cards = project.cards;

    this.onChange({
      ...project,
      cards: replace(cards, index, item),
    });
  }

  onItemRemove = (index: number) => {
    const { project } = this.props;
    const cards = project.cards;

    this.onChange({
      ...project,
      cards: remove(cards, index),
    });
  }

  render() {
    const { project } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ flex: '1 1 1px', overflowY: 'scroll', }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={project.id}>
              {(provided) => (
                <ListGroup
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    marginTop: 8,
                  }}
                  as="ol"
                >
                  {project.cards.map((item, index) => <ProjectCardItem
                    key={item.id}
                    item={item}
                    index={index}
                    onChange={this.onItemChange}
                    onDelete={this.onItemRemove}
                  />)}
                  {provided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div style={{ textAlign: 'right' }}>
          Card Count: {project.cards.reduce((value, card) => value + card.count, 0)}
        </div>
      </div>
    );
  }
}
