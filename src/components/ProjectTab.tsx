import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FileEarmarkPlus, Upload, XCircle } from "react-bootstrap-icons";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { is } from 'typescript-is';
import unitData from "../api/data/unit.json";
import { createProject, Settings, UploadedImage } from "../api/mpc_api";
import { Site, Unit } from "../types/mpc";
import { ParsedProject, Project } from "../types/project";
import { remove, reorder, replace } from "../util";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";
import ProjectEditModal from "./ProjectEditModal";
import ProjectItem from "./ProjectItem";
import ProjectSettingsModal from "./ProjectSettingsModal";
import ProjectSuccessModal from "./ProjectSuccessModal";

interface SettingsState {
  id: 'settings';
  name: string | undefined;
  unit: Unit;
  cards: UploadedImage[];
}

interface LoadingState {
  id: 'loading';
  value: number;
}

interface FinishedState {
  id: 'finished';
  value: string;
}

interface ErrorState {
  id: 'error';
  value: any;
}

interface ItemEditState {
  id: 'item-edit',
  index: number,
  item: ParsedProject,
}

interface ProjectTabProps {
  site: Site;
}

interface ProjectTabState {
  state: null | LoadingState | FinishedState | ErrorState | SettingsState | ItemEditState;
  items: ParsedProject[];
}

export default class ProjectTab extends React.Component<ProjectTabProps, ProjectTabState> {
  static projectId = 0;
  static cardId = 0;

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: ProjectTabProps) {
    super(props);

    this.fileInput = React.createRef<HTMLInputElement>();

    this.state = {
      state: null,
      items: [],
    };
  }

  onAdd = async (e: any) => {
    if (e.target.files == null) return;

    const { site } = this.props;
    const items = [
      ...this.state.items,
    ];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i] as File;
      try {
        const data = JSON.parse(await file.text());
        if (!is<Project>(data)) {
          this.setState({
            state: {
              id: 'error',
              value: `${file.name}\n\nInvalid project file`,
            }
          });
          return;
        }

        const unitCode = data.code;
        const unit = unitData.find((it) => it.code === unitCode);
        if (!unit) {
          this.setState({
            state: {
              id: 'error',
              value: `${file.name}\n\nProject product type not found: ${unitCode}`,
            },
          });
          return;
        } else if (!unit.siteCodes.includes(site.code)) {
          this.setState({
            state: {
              id: 'error',
              value: `${file.name}\n\nProject is not compatible with: ${location.origin}`,
            },
          });
          return;
        }

        items.push({
          ...data,
          id: `${++ProjectTab.projectId}`,
          name: file.name,
          unit,
          cards: data.cards.map((card) => ({
            id: ProjectTab.cardId++,
            ...card,
          })),
        });
      } catch (e) {
        this.setState({
          state: {
            id: 'error',
            value: `${file.name}\n\nCould not parse file`,
          },
        });
        return;
      }
    }

    this.setState({
      items: items,
    });
  }

  onItemChange = (index: number, item: ParsedProject) => {
    const { items } = this.state;
    this.setState({
      state: null,
      items: replace(items, index, item),
    });
  }

  onItemEdit = (index: number, item: ParsedProject) => {
    this.setState({
      state: {
        id: 'item-edit',
        index: index,
        item: item,
      },
    })
  }

  onItemRemove = (index: number) => {
    const items = this.state.items;
    if (index < 0) return;

    this.setState({
      items: remove(items, index),
    });
  }

  onClear = () => {
    this.setState({
      items: []
    });
  }

  onUpload = async (settings: Settings, cards: UploadedImage[]) => {
    this.setState({
      state: {
        id: 'loading',
        value: 0,
      },
    });

    try {
      const projectUrl = await createProject(settings, cards);

      this.setState({
        items: [],
        state: {
          id: 'finished',
          value: projectUrl,
        },
      });
    } catch (e) {
      this.setState({
        state: {
          id: 'error',
          value: e,
        },
      });
      return;
    }
  }

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  onStateClear = () => {
    this.setState({
      state: null,
    });
  }

  onUploadClick = () => {
    const { items } = this.state;
    const unit = items.every((it) => it.unit.code === items[0]?.unit.code) ? items[0].unit : null;
    console.log(unit);

    if (unit) {
      this.setState({
        state: {
          id: 'settings',
          name: items.length === 1 ? items[0].name : undefined,
          unit: unit,
          cards: items.reduce<UploadedImage[]>((value, item) => {
            value.push(...item.cards);
            return value;
          }, []),
        },
      });
    } else {
      this.setState({
        state: {
          id: 'error',
          value: 'Every project must have the same product type',
        },
      });
    }
  }

  render() {
    const { site } = this.props;
    const { items, state } = this.state;
    const sameProduct = items.every((item) => item.unit.code === items[0]?.unit.code);
    console.log(state);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            id="project-input"
            key={Date.now()}
            ref={this.fileInput}
            type="file"
            multiple
            accept='.txt'
            onChange={this.onAdd}
          />
          <Button variant="outline-primary" onClick={() => this.fileInput.current!.click()}>
            <FileEarmarkPlus /> Add projects
          </Button>
          <Button variant="outline-primary" onClick={this.onClear}>
            <XCircle /> Clear
          </Button>
          <div style={{ flex: 1 }} />
          <Button variant="outline-primary" onClick={this.onUploadClick} disabled={!sameProduct}>
            <Upload /> Upload
          </Button>
        </div>
        {!sameProduct && (
          <Alert variant="warning" style={{ marginBottom: 0 }}>
            Every project must have the same product type
          </Alert>
        )}
        <div style={{ flex: '1 1 1px', overflowY: 'scroll' }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <ListGroup
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  as="ol"
                >
                  {items.map((item, index) => <ProjectItem
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={this.onItemEdit}
                    onDelete={this.onItemRemove}
                  />)}
                  {provided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div style={{ textAlign: 'right' }}>
          Card Count: {items.reduce<number>((value, item) => {
            return item.cards.reduce<number>((value, card) => value + card.count, value);
          }, 0)}
        </div>
        {is<SettingsState>(state) && (
          <ProjectSettingsModal
            site={site}
            unit={state.unit}
            name={state.name}
            cards={state.cards}
            onUpload={this.onUpload}
            onClose={this.onStateClear}
          />
        )}
        {is<LoadingState>(state) && <LoadingModal
          onClose={this.onStateClear}
        />}
        {is<FinishedState>(state) && <ProjectSuccessModal
          value={state.value}
          onClose={this.onStateClear}
        />}
        {is<ErrorState>(state) && <ErrorModal
          value={state.value}
          onClose={this.onStateClear}
        />}
        {is<ItemEditState>(state) && <ProjectEditModal
          index={state.index}
          item={state.item}
          onSave={this.onItemChange}
          onClose={this.onStateClear}
        />}
      </div>
    );
  }
}