import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { CardImage, FileEarmarkPlus, PlusCircle, Upload, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { analysisImage, CardSettings, CompressedImageData, compressImageData, createAutoSplitProject, Settings, UploadedImage, uploadImage } from "../api/mpc_api";
import { Card, CardFaces, CardSide } from "../types/card";
import { Site, Unit } from "../types/mpc";
import { Project } from "../types/project";
import { analyseCard, remove, reorder, replace, setStateAsync } from "../util";
import AutofillModal from "./AutofillModal";
import CardPreviewModal from "./CardPreviewModal";
import ErrorModal from "./ErrorModal";
import ImageItem from "./ImageItem";
import ImageSettingsModal from "./ImageSettingsModal";
import ProgressModal from "./ProgressModal";
import SaveProjectModal from "./SaveProjectModal";
import { ImageTabSettings, ProjectTabSettings } from "./App";
import ProjectTab from "./ProjectTab";
import { FilenameTooltip } from "./AutofillTypeBasic";

interface AutofillState {
  id: 'autofill';
  cardSides: CardSide[];
}

interface SettingsState {
  id: 'settings';
}

const isSettingState = (item: any): item is SettingsState => {
  return item instanceof Object && item['id'] === 'settings';
}

interface LoadingState {
  id: 'loading';
  title: string;
  value: number;
  maxValue: number;
}

const isLoadingState = (item: any): item is LoadingState => {
  return item instanceof Object && item['id'] === 'loading';
}

interface FinishedState {
  id: 'finished';
  name?: string;
  value: Project;
  urls?: string[];
}

const isFinishedState = (item: any): item is FinishedState => {
  return item instanceof Object && item['id'] === 'finished';
}

interface ErrorState {
  id: 'error';
  value: any;
}

const isErrorState = (item: any): item is ErrorState => {
  return item instanceof Object && item['id'] === 'error';
}

interface PreviewState {
  id: 'preview';
}

const isPreviewState = (item: any): item is PreviewState => {
  return item instanceof Object && item['id'] === 'preview';
}

interface ImageTabProps {
  site: Site;
  onSetTab: (project: ProjectTabSettings | ImageTabSettings) => void;
}

interface ImageTabState {
  files: CardSide[];
  cards: Card[];
  unit?: Unit;
  state: null | LoadingState | FinishedState | ErrorState | SettingsState | PreviewState | AutofillState;
}

export default class ImageTab extends React.Component<ImageTabProps, ImageTabState> {
  static cardId = 0;
  static fileId = 0;

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: ImageTabProps) {
    super(props);

    this.fileInput = React.createRef<HTMLInputElement>();

    this.state = {
      state: null,
      files: [],
      cards: [],
      unit: undefined,
    };
  }

  onAdd = async (e: React.FormEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files;
    const total = selectedFiles?.length;
    if (!total) return;

    await setStateAsync(this, {
      state: {
        id: 'loading',
        title: 'Analysing images...',
        value: 0,
        maxValue: total,
      }
    });

    let count = 0;
    const promiseList: Promise<CardSide>[] = [];
    for (let i = 0; i < total; i++) {
      promiseList.push(analyseCard(selectedFiles[i]).then(({ file, width, height }) => ({
        id: ImageTab.fileId++,
        file: file,
        info: {
          width,
          height,
        },
      })).then(it => {
        this.setState({
          state: {
            id: 'loading',
            title: 'Analysing images...',
            value: ++count,
            maxValue: total,
          }
        });
        return it;
      }));
    }

    const cardSides = await Promise.all(promiseList);
    cardSides.sort((a, b) => {
      return a.file.name.localeCompare(b.file.name);
    })

    await setStateAsync(this, {
      state: {
        id: 'autofill',
        cardSides,
      },
    });
  }

  onAddCards = (cardSides: CardSide[], cards: Card[]) => {
    this.setState({
      state: null,
      files: [
        ...this.state.files,
        ...cardSides
      ],
      cards: [
        ...this.state.cards,
        ...cards,
      ],
    });
  }

  onAddEmptyItem = () => {
    const { cards } = this.state;

    this.setState({
      cards: [
        ...cards,
        {
          id: ImageTab.fileId++,
          count: 1,
        }
      ],
    });
  }

  onItemChange = (index: number, item: Card) => {
    const { cards } = this.state;

    this.setState({
      cards: replace(cards, index, item),
    });
  }

  onItemRemove = (index: number) => {
    const { cards } = this.state;

    this.setState({
      cards: remove(cards, index),
    });
  }

  onPreview = () => {
    this.setState({
      state: {
        id: 'preview'
      },
    });
  }

  onClear = () => {
    this.setState({
      cards: [],
      files: [],
    });
  }

  uploadCards = async (settings: CardSettings, cards: Card[]) => {
    const maxValue = cards.reduce<Set<File>>((p, v) => {
      if (v.front) p.add(v.front?.file);
      if (v.back) p.add(v.back?.file);
      return p;
    }, new Set()).size;

    await setStateAsync(this, {
      state: {
        id: 'loading',
        title: 'Uploading...',
        value: 0,
        maxValue,
      },
    })

    const files = new Map<string, CompressedImageData>();
    const data: UploadedImage[] = [];
    for (const card of cards) {
      const cardData: UploadedImage = {
        count: card.count,
      };
      for (const side of CardFaces) {
        const cardSide = card[side];
        if (!cardSide) continue;

        const id = `${cardSide.id}-${side}`;
        if (files.has(id)) {
          cardData[side] = files.get(id);
        } else {
          if (this.state.state?.id !== 'loading') return;
          const uploadedImage = await uploadImage(settings, side, cardSide.file);

          if (this.state.state?.id !== 'loading') return;
          const analysedImage = await analysisImage(settings, side, 0, uploadedImage);

          const compressedImageData = {
            Name: cardSide.file.name,
            ...compressImageData(analysedImage, uploadedImage),
          };
          cardData[side] = compressedImageData
          files.set(id, compressedImageData);

          if (this.state.state?.id !== 'loading') return;
          await setStateAsync(this, {
            state: {
              id: 'loading',
              title: 'Uploading...',
              value: files.size,
              maxValue,
            },
          });
        }
      }
      data.push(cardData);
    }

    return data;
  }

  onCardUpload = async (settings: CardSettings, cards: Card[]) => {
    try {
      const data = await this.uploadCards(settings, cards);
      if (data === undefined) return;

      this.setState({
        files: [],
        cards: [],
        state: {
          id: 'finished',
          value: {
            version: 1,
            code: settings.unit,
            cards: data,
          },
        },
      });
      return;
    } catch (e) {
      console.log(e);
      this.setState({
        state: {
          id: 'error',
          value: e,
        },
      });
      return;
    }
  }

  onProjectUpload = async (name: string | undefined, settings: Settings, cards: Card[]) => {
    try {
      const data = await this.uploadCards(settings, cards);
      if (data === undefined) return;

      this.setState({
        files: [],
        cards: [],
        state: {
          id: 'finished',
          name,
          value: {
            version: 1,
            code: settings.unit,
            cards: data,
          },
          urls: await createAutoSplitProject(settings, data),
        },
      });
      return;
    } catch (e) {
      console.log(e);
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

    const cards = reorder(
      this.state.cards,
      result.source.index,
      result.destination.index
    );

    this.setState({
      cards,
    });
  }

  onStateClear = () => {
    this.setState({
      state: null,
    });
  }

  onProductChange = (eventKey: any) => {
    const { site } = this.props;
    const unit = site.unitList.find(it => it.code == eventKey);
    this.setState({
      unit,
    })
  }

  onLoadProject = (name: string | undefined, project: Project) => {
    const { site } = this.props;
    const unitCode = project.code;
    const unit = site.unitList.find(it => it.code === unitCode)!;

    const parsedProject = {
      ...project,
      id: `${++ProjectTab.projectId}`,
      name: name ?? 'Unknown',
      unit,
      cards: project.cards.map((card: any) => ({
        id: ProjectTab.cardId++,
        ...card,
      })),
    }

    this.props.onSetTab({
      id: 'project',
      items: [
        parsedProject,
      ]
    })
  }

  render() {
    const { site } = this.props;
    const { cards, files, unit, state } = this.state;
    const cardCount = cards.reduce<number>((v, card) => v + card.count, 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            id="image-input"
            key={Date.now()}
            ref={this.fileInput}
            type="file"
            multiple
            accept='.png, .jpg'
            onChange={this.onAdd}
          />
          <Button variant="outline-primary" onClick={() => this.fileInput.current!.click()}>
            <FileEarmarkPlus /> Add images
          </Button>
          <Button variant="outline-primary" onClick={this.onAddEmptyItem}>
            <PlusCircle /> Add empty card
          </Button>
          <Button variant="outline-primary" onClick={this.onClear}>
            <XCircle /> Clear
          </Button>
          <div style={{ flex: 1 }} />
          <Dropdown onSelect={this.onProductChange}>
            <Dropdown.Toggle variant="outline-primary">
              {unit?.name ?? 'Select Product'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: 300, overflowY: 'scroll' }}>
              <Dropdown.Header>Recomended</Dropdown.Header>
              {site.unitList.filter(it => it.curated !== null).map(it => (
                <Dropdown.Item key={it.code} eventKey={it.code} active={it.code === unit?.code}>{it.name}</Dropdown.Item>
              ))}
              <Dropdown.Header>Other</Dropdown.Header>
              {site.unitList.filter(it => it.curated === null).map(it => (
                <Dropdown.Item key={it.code} eventKey={it.code} active={it.code === unit?.code}>{it.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-primary" onClick={this.onPreview}>
            <CardImage /> Preview
          </Button>
          <Button variant="outline-primary" onClick={() => this.setState({
            state: {
              id: 'settings',
            }
          })}>
            <Upload /> Upload
          </Button>
        </div>
        <div style={{ flex: '1 1 1px', overflowY: 'scroll', }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <ListGroup
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  as="ol"
                >
                  {cards.map((card, index) => <ImageItem
                    key={card.id}
                    item={card}
                    files={files}
                    unit={unit}
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
        {unit && <div style={{ textAlign: 'right' }}>
        <FilenameTooltip text={`Card Count: ${cardCount} / ${unit.maxCards}`}>
            The max amount of cards a project can have is {unit.maxCards}.<br/>
            If you add more than {unit.maxCards} then the project will be automatically split into multiple projects.
          </FilenameTooltip>
        </div>}
        {state?.id === 'autofill' && <AutofillModal
          cardSides={state.cardSides}
          onAdd={this.onAddCards}
          onClose={this.onStateClear}
        />}
        {isSettingState(state) && <ImageSettingsModal
          site={site}
          unit={unit}
          cards={cards}
          onCardUpload={this.onCardUpload}
          onProjectUpload={this.onProjectUpload}
          onClose={this.onStateClear}
        />}
        {
          isLoadingState(state) && <ProgressModal
            title={state.title}
            value={state.value}
            maxValue={state.maxValue}
            onClose={this.onStateClear}
          />
        }
        {
          isFinishedState(state) && <SaveProjectModal
            message='Your images were successfully uploaded'
            name={state.name}
            project={state.value}
            urls={state.urls}
            onLoadProject={this.onLoadProject}
            onClose={this.onStateClear}
          />
        }
        {
          isErrorState(state) && <ErrorModal
            value={state.value}
            onClose={this.onStateClear}
          />
        }
        {
          isPreviewState(state) && <CardPreviewModal
            site={site}
            unit={unit}
            cards={cards}
            onClose={this.onStateClear}
          />
        }
      </div>
    );
  }
}
