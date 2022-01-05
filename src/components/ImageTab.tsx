import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FileEarmarkPlus, PlusCircle, Upload, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import { is } from 'typescript-is';
import { analysisImage, CardSettings, CompressedImageData, compressImageData, UploadedImage, uploadImage } from "../api/mpc_api";
import ErrorModal from "./ErrorModal";
import ImageItem from "./ImageItem";
import ImageSettingsModal from "./ImageSettingsModal";
import ImageSuccessModal from "./ImageSuccessModal";
import ProgressModal from "./ProgressModal";
import { Project } from "./ProjectTab";


async function setStateAsync<P, S, K extends keyof S>(
  component: React.Component<P, S>,
  state:
    ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) |
    Pick<S, K> |
    S |
    null
) {
  return new Promise(resolve => component.setState(state, () => resolve(null)));
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export interface CardSide {
  id: number;
  name: string;
  file: File;
}

export interface Card {
  id: number;
  name?: string;
  front?: CardSide;
  back?: CardSide;
  count: number;
}

interface CardListGroup {
  key: string;
  front?: CardSide;
  back?: CardSide;
  items: (Card | undefined)[];
}

interface SettingsState {
  id: 'settings',
}

interface LoadingState {
  id: 'loading';
  value: number;
  maxValue: number;
}

interface FinishedState {
  id: 'finished';
  value: Project;
}

interface ErrorState {
  id: 'error';
  value: any;
}

interface ImageTabProps {
  siteCode: string;
}

interface ImageTabState {
  files: CardSide[];
  cards: Card[];
  state: null | LoadingState | FinishedState | ErrorState | SettingsState;
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
    };
  }

  onAdd = async (e: any) => {
    const { files, cards } = this.state;

    const selectedFiles = e.target.files;
    if (selectedFiles === null || selectedFiles.length === 0) return;

    const re = /^(.+?)(\d+)?\-?(?:(front|back|a|b|1|2))?\.(png|jpg)$/;

    const cardSides: CardSide[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      cardSides.push({
        id: ImageTab.fileId++,
        name: file.name,
        file: file,
      });
    }

    const groups: {
      [key: string]: CardListGroup,
    } = {};
    for (const file of cardSides) {
      const match = file.file.name.match(re);
      console.log(match);
      if (!match) continue;

      const groupName = match[1];
      const side = match[3];

      const group = groups[groupName] ??= {
        key: groupName,
        items: [],
      };
      if (!match[2] && (side === 'front' || side === 'back')) {
        group[side] = file;
      } else {
        const index = parseInt(match[2]) || 0;
        const side = match[3] === 'b' || match[3] === '2' || match[3] === 'back' ? 'back' : 'front';
        const card = group.items[index] ??= {
          id: ImageTab.cardId++,
          count: 1,
        };
        card[side] = file;
      }
    }
    console.log(groups);
    for (const group of Object.values(groups)) {
      const lastCardSide: {
        front?: CardSide;
        back?: CardSide;
      } = {};
      for (let i = group.items.length - 1; i >= 0; i--) {
        const card = group.items[i];
        if (!card) continue;

        for (const side of ['front', 'back'] as ('front' | 'back')[]) {
          lastCardSide[side] = card[side] ??= group[side] ?? lastCardSide[side];
        }
      }
    }

    this.setState({
      files: [
        ...files,
        ...cardSides,
      ],
      cards: Object.values(groups).reduce<Card[]>((list, group) => {
        if (group.items.length === 0) {
          list.push({
            id: ImageTab.cardId++,
            name: group.front?.name ?? group.back?.name,
            front: group.front,
            back: group.back,
            count: 1,
          });
        } else {
          const card = group.items[0];
          if (card) {
            list.push({
              ...card,
              name: card.front?.name ?? card.back?.name,
              count: card.count,
            });
          }

          let i = 1;
          let count = 0;
          while (i < group.items.length) {
            const card = group.items[i];
            count++;
            if (card) {
              list.push({
                ...card,
                name: card.front?.name ?? card.back?.name,
                count: count,
              });
              count = 0;
            }
            i++;
          }
        }
        return list;
      }, [...cards]),
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
      cards: [
        ...cards.slice(0, index),
        item,
        ...cards.slice(index + 1),
      ],
    });
  }

  onItemRemove = (index: number) => {
    const { cards } = this.state;

    this.setState({
      cards: [
        ...cards.slice(0, index),
        ...cards.slice(index + 1),
      ],
    });
  }

  onClear = () => {
    this.setState({
      cards: [],
      files: [],
    });
  }

  onUpload = async (settings: CardSettings) => {
    const { cards } = this.state;

    const maxValue = cards.reduce<Set<File>>((p, v) => {
      if (v.front) p.add(v.front?.file);
      if (v.back) p.add(v.back?.file);
      return p;
    }, new Set()).size;

    await setStateAsync(this, {
      state: {
        id: 'loading',
        value: 0,
        maxValue,
      },
    })

    const files = new Map<string, CompressedImageData>();
    const data: UploadedImage[] = [];
    try {
      for (const card of cards) {
        const cardData: UploadedImage = {
          name: card.name,
          count: card.count,
        };
        for (const side of ['front', 'back'] as ('front' | 'back')[]) {
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

            const compressedImageData = compressImageData(analysedImage, uploadedImage);
            cardData[side] = compressedImageData
            files.set(id, compressedImageData);

            if (this.state.state?.id !== 'loading') return;
            await setStateAsync(this, {
              state: {
                id: 'loading',
                value: files.size,
                maxValue,
              },
            });
          }
        }
        data.push(cardData);
      }

      this.setState({
        files: [],
        cards: [],
        state: {
          id: 'finished',
          value: {
            version: 1,
            code: settings.unit,
            cards: data
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

  render() {
    const { siteCode } = this.props;
    const { cards, files, state } = this.state;

    return (
      <>
        <div style={{ display: 'flex', rowGap: 4, columnGap: 4 }}>
          <input
            id="image-input"
            key={Date.now()}
            ref={this.fileInput}
            type="file"
            multiple={true}
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
          <Button variant="outline-primary" onClick={() => this.setState({
            state: {
              id: 'settings',
            }
          })}>
            <Upload /> Upload
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
                  {cards.map((card, index) => <ImageItem
                    key={card.id}
                    item={card}
                    files={files}
                    index={index}
                    onChange={this.onItemChange}
                    onDelete={this.onItemRemove}
                  />)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
        {is<SettingsState>(state) && <ImageSettingsModal siteCode={siteCode} onUpload={this.onUpload} onClose={this.onStateClear} />}
        {is<LoadingState>(state) && <ProgressModal value={state.value} maxValue={state.maxValue} onClose={this.onStateClear} />}
        {is<FinishedState>(state) && <ImageSuccessModal value={state.value} onClose={this.onStateClear} />}
        {is<ErrorState>(state) && <ErrorModal value={state.value} onClose={this.onStateClear} />}
      </>
    );
  }
}