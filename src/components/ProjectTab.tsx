import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FileEarmarkPlus, Upload, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import { is } from 'typescript-is';
import unitData from "../api/data/unit.json";
import { createProject, Settings, UploadedImage } from "../api/mpc_api";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";
import ProjectItem from "./ProjectItem";
import ProjectSettingsModal from "./ProjectSettingsModal";
import ProjectSuccessModal from "./ProjectSuccessModal";


function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export interface Project {
  version: 1;
  code: string,
  cards: UploadedImage[];
}

export interface Unit {
  code: string;
  name: string;
  site_code: string;
  product_code: string;
  front_design_code: string;
  back_design_code: string;
};

export interface Item {
  id: string;
  name: string;
  data: Project;
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
  siteCode: string;
}

interface ProjectTabState {
  items: Item[];
  state: null | LoadingState | FinishedState | ErrorState | SettingsState;
}

export default class ProjectTab extends React.Component<ProjectTabProps, ProjectTabState> {
  static itemId = 0;

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
        }

        items.push({
          id: `${++ProjectTab.itemId}`,
          name: file.name,
          data,
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

  onItemRemove = (item: Item) => {
    const items = this.state.items;
    const index = items.indexOf(item);
    if (index < 0) return;

    this.setState({
      items: [
        ...items.slice(0, index),
        ...items.slice(index + 1),
      ],
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
      console.log(projectUrl);

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
          cards: items.reduce((value, item) => {
            value.push(...item.data.cards);
            return value;
          }, [] as UploadedImage[]),
        }
      });
    } else {
      this.setState({
        state: {
          id: 'error',
          value: 'Not every project has the same product type',
        }
      });
    }
  }

  render() {
    const { items, state } = this.state;

    return (
      <>
        <div style={{ display: 'flex', rowGap: 4, columnGap: 4 }}>
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
            <FileEarmarkPlus />
          </Button>
          <Button variant="outline-primary" onClick={this.onClear}>
            <XCircle />
          </Button>
          <div style={{ flex: 1 }} />
          <Button variant="outline-primary" onClick={this.onUploadClick}>
            <Upload />
          </Button>
        </div>
        <Stack gap={3} style={{ marginTop: 8, minHeight: 200 }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    border: '1px solid #bbb',
                    padding: 8,
                  }}
                >
                  {items.map((item, index) => <ProjectItem item={item} index={index} onDelete={this.onItemRemove} />)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
        {is<SettingsState>(state) && <ProjectSettingsModal unit={state.unit} cards={state.cards} onUpload={this.onUpload} onClose={this.onStateClear} />}
        {is<LoadingState>(state) && <LoadingModal onClose={this.onStateClear} />}
        {is<FinishedState>(state) && <ProjectSuccessModal value={state.value} onClose={this.onStateClear} />}
        {is<ErrorState>(state) && <ErrorModal value={state.value} onClose={this.onStateClear} />}
      </>
    );
  }
}