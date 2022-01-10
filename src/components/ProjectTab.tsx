import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FileEarmarkPlus, Upload, XCircle } from "react-bootstrap-icons";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { is } from 'typescript-is';
import unitData from "../api/data/unit.json";
import { createProject, Settings, UploadedImage } from "../api/mpc_api";
import { remove, reorder, replace } from "../util";
import { Site } from "./App";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";
import ProjectCardList from "./ProjectCardList";
import ProjectItem from "./ProjectItem";
import ProjectSettingsModal from "./ProjectSettingsModal";
import ProjectSuccessModal from "./ProjectSuccessModal";


export interface ProjectCard extends UploadedImage {
  id: number;
}

export interface Project {
  version: 1;
  code: string;
  cards: UploadedImage[];
}

export interface ParsedProject extends Project {
  cards: ProjectCard[];
}

export interface Unit {
  code: string;
  name: string;
  siteCodes: string[];
  productCode: string;
  frontDesignCode: string;
  backDesignCode: string;
  width: number;
  height: number;
  dpi: number;
  filter: string;
  auto: boolean;
  scale: number;
  sortNo: number;
  applyMask: boolean;
};

export interface Item {
  id: string;
  name: string;
  data: ParsedProject;
  unit: Unit;
}

interface SettingsState {
  id: 'settings';
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

interface ProjectTabProps {
  site: Site;
}

interface ProjectTabState {
  state: null | LoadingState | FinishedState | ErrorState | SettingsState;
  view: 'projects' | 'images';
  items: Item[];
}

export default class ProjectTab extends React.Component<ProjectTabProps, ProjectTabState> {
  static itemId = 0;
  static cardId = 0;

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: ProjectTabProps) {
    super(props);

    this.fileInput = React.createRef<HTMLInputElement>();

    this.state = {
      state: null,
      view: 'projects',
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
          id: `${++ProjectTab.itemId}`,
          name: file.name,
          data: {
            ...data,
            cards: data.cards.map((card) => ({
              id: ProjectTab.cardId++,
              ...card,
            })),
          },
          unit,
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

  onItemChange = (index: number, item: Item) => {
    const { items } = this.state;
    this.setState({
      items: replace(items, index, item),
    });
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
    const unit = items.every((it) => it.unit.code === items[0].unit.code) ? items[0].unit : null;

    if (unit) {
      this.setState({
        state: {
          id: 'settings',
          unit: unit,
          cards: items.reduce<UploadedImage[]>((value, item) => {
            value.push(...item.data.cards);
            return value;
          }, []),
        }
      });
    } else {
      this.setState({
        state: {
          id: 'error',
          value: 'Every project must have the same product type',
        }
      });
    }
  }

  renderProjects = () => {
    const { view, items } = this.state;
    if (view === 'projects') {
      return (
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
                  onDelete={this.onItemRemove}
                />)}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      );
    } else if (view === 'images') {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ListGroup
                {...provided.droppableProps}
                ref={provided.innerRef}
                as="ol"
              >
                {items.map((project, index) => <ProjectCardList
                  key={project.id}
                  index={index}
                  project={project}
                  onChange={this.onItemChange}
                  onDelete={this.onItemRemove}
                />)}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
    return null;
  }

  render() {
    const { site } = this.props;
    const { items, state, view } = this.state;

    const sameProduct = items.every((item) => item.unit.code === items[0]?.unit.code);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            id="project-input"
            key={Date.now()}
            ref={this.fileInput}
            type="file"
            multiple={true}
            accept='.txt'
            onChange={this.onAdd}
          />
          <Button variant="outline-primary" onClick={() => this.fileInput.current!.click()}>
            <FileEarmarkPlus /> Add projects
          </Button>
          <Button variant="outline-primary" onClick={this.onClear}>
            <XCircle /> Clear
          </Button>
          <ButtonGroup>
            <Button variant="outline-primary" active={view === 'projects'} onClick={() => this.setState({
              view: 'projects',
            })}>
              Projects
            </Button>
            <Button variant="outline-primary" active={view === 'images'} onClick={() => this.setState({
              view: 'images',
            })}>
              Images
            </Button>
          </ButtonGroup>
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
        <this.renderProjects />
        {is<SettingsState>(state) && <ProjectSettingsModal site={site} unit={state.unit} cards={state.cards} onUpload={this.onUpload} onClose={this.onStateClear} />}
        {is<LoadingState>(state) && <LoadingModal onClose={this.onStateClear} />}
        {is<FinishedState>(state) && <ProjectSuccessModal value={state.value} onClose={this.onStateClear} />}
        {is<ErrorState>(state) && <ErrorModal value={state.value} onClose={this.onStateClear} />}
      </div>
    );
  }
}