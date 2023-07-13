import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { CardImage, FileEarmarkPlus, PlusCircle, Upload, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import ListGroup from "react-bootstrap/esm/ListGroup";
import unitData from "../api/data/unit.curated.json";
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
      })).then((it) => {
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

  onProjectUpload = async (settings: Settings, cards: Card[]) => {
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
    const unit = unitData.find((it) => it.code == eventKey);
    this.setState({
      unit,
    })
  }

  render() {
    const { site } = this.props;
    const { cards, files, unit, state } = this.state;

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
              {unit?.name[site.code as "mpc" | "ps"] ?? 'Select Product'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{maxHeight: 300, overflowY: 'scroll'}}>
              {unitData.filter((it) => site.code in it.name).map((it) => (
                <Dropdown.Item key={it.code} eventKey={it.code} active={it.code === unit?.code}>{(it.name as any)[site.code]}</Dropdown.Item>
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
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }} />
          <div>
            Card Count: {cards.reduce((value, card) => value + card.count, 0)}
          </div>
        </div>
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
            value={state.value}
            urls={state.urls}
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
