import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";

import { Item } from "./ProjectTab";


interface ProjectItemProps {
  index: number;
  item: Item;
  onDelete: (item: Item) => void;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  userSelect: "none",
  padding: 8,
  opacity: isDragging ? 0.5 : 1,

  ...draggableStyle
});

export default class ProjectItem extends React.Component<ProjectItemProps> {
  onDelete = () => {
    const { item, onDelete } = this.props;
    onDelete(item);
  }

  render() {
    const { index, item } = this.props;
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
          >
            <div style={{ display: 'flex' }}>
              <div style={{ width: 40, alignSelf: 'center', }}>{index + 1}</div>
              <div style={{ flex: 1, alignSelf: 'center', }}>
                <div>{item.name}</div>
                <div>Product: {item.unit.name}</div>
              </div>
              <div style={{ width: 40, alignSelf: 'center', }}>x {item.data.cards.reduce((v, card) => v + (card.count ?? 1), 0)}</div>
              <Button variant="outline-primary" onClick={this.onDelete}>
                <Trash />
              </Button>
            </div>
            <hr className="solid" />
          </div>
        )}
      </Draggable>
    );
  }
}