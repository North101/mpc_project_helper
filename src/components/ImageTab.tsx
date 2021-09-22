import * as React from "react";

import { Button } from "devextreme-react/button";
import { DropDownButton } from "devextreme-react/drop-down-button";
import { ItemDragging, List } from "devextreme-react/list";
import { NumberBox } from "devextreme-react/number-box";
import { Popup, ToolbarItem } from "devextreme-react/popup";

import { uploadImage, analysisImage, compressImageData, CompressedImageData, UploadedImage } from "../mpc_api";
import { LoadIndicator } from "devextreme-react/load-indicator";

interface ListItemProps {
  files: CardSide[];
  cards: Card[];
  index: number;
  updateCards: (cards: Card[]) => void,
}

class ListItem extends React.Component<ListItemProps, never> {
  onCardSideChange = (args: any, side: 'front' | 'back') => {
    const { cards, index, updateCards } = this.props;
    updateCards([
      ...cards.slice(0, index),
      {
        ...cards[index],
        [side]: args.itemData,
      },
      ...cards.slice(index + 1),
    ]);
  }

  onFrontChange = (args: any) => {
    this.onCardSideChange(args, 'front');
  }

  onBackChange = (args: any) => {
    this.onCardSideChange(args, 'back');
  }

  onCountChange = (value: number) => {
    const { cards, index, updateCards } = this.props;
    const card = cards[index];
    updateCards([
      ...cards.slice(0, index),
      {
        ...card,
        count: value,
      },
      ...cards.slice(index + 1),
    ]);
  }

  render() {
    const { files, cards, index } = this.props;
    const card = cards[index];
    return (
      <div style={{ display: 'flex', }}>
        <div style={{ flex: 1, padding: 2, }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: 2, }}>
            <div style={{ width: 'unset', padding: 2, }}>Front</div>
            <div style={{ flex: 1, width: 'unset', display: 'flex', justifyContent: 'end' }}>
              <DropDownButton
                useSelectMode={true}
                displayExpr="name"
                keyExpr="id"
                width="100%"
                dropDownOptions={{ height: 400 }}
                dataSource={files}
                text={card.front?.name}
                selectedItemKey={card.front?.id}
                onItemClick={this.onFrontChange}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: 2, }}>
            <div style={{ width: 'unset', padding: 2, }}>Back</div>
            <div style={{ flex: 1, width: 'unset', display: 'flex', justifyContent: 'end', textAlign: 'start' }}>
              <DropDownButton
                useSelectMode={true}
                displayExpr="name"
                keyExpr="id"
                width="100%"
                dropDownOptions={{ height: 400 }}
                dataSource={files}
                text={card.back?.name}
                selectedItemKey={card.back?.id}
                onItemClick={this.onBackChange}
              />
            </div>
          </div>
        </div>
        <div style={{ alignSelf: 'center', padding: 2, textAlign: 'center', }}>x</div>
        <div style={{ alignSelf: 'center', padding: 2, textAlign: 'center', }}>
          <NumberBox
            width={70}
            defaultValue={card.count}
            min={1}
            showSpinButtons={true}
            onValueChange={this.onCountChange}
          />
        </div>
      </div>
    );
  }
}

interface CardListGroup {
  key: string;
  items: Card[];
}

let cardId = 0;

export interface Card {
  id: number;
  count: number;
  front?: CardSide;
  back?: CardSide;
}

let fileId = 0;

interface CardSide {
  id: number;
  name: string;
  file: File;
}

export interface ImagesTabProps { }

export interface ImagesTabState {
  files: CardSide[];
  cards: Card[];
  state: null | {
    id: 'loading',
    value: number,
    maxValue: number;
  } | {
    id: 'finished',
    value: UploadedImage[],
  } | {
    id: 'error',
    value: unknown,
  };
  inputKey: number;
}

export default class ImagesTab extends React.Component<ImagesTabProps, ImagesTabState> {
  constructor(props: ImagesTabProps) {
    super(props);

    this.state = {
      files: [],
      cards: [],
      state: null,
      inputKey: 0,
    }
  }

  addItem = (cards: Card[], index: number, itemData: Card) => {
    return [
      ...cards.slice(0, index),
      itemData,
      ...cards.slice(index),
    ];
  }

  removeItem = (cards: Card[], index: number) => {
    return [
      ...cards.slice(0, index),
      ...cards.slice(index + 1),
    ];
  }

  onItemDragStart = (e: any) => {
    e.itemData = this.state.cards[e.fromIndex];
  }

  onItemAdd = (e: any) => {
    const { cards } = this.state;
    this.setState({
      cards: this.addItem(cards, e.toIndex, e.itemData),
    });
  }

  onItemRemove = (e: any) => {
    const { cards } = this.state;
    this.setState({
      cards: this.removeItem(cards, e.fromIndex),
    });
  }

  onItemReorder = (e: any) => {
    const { cards } = this.state;
    this.setState({
      cards: this.addItem(this.removeItem(cards, e.fromIndex), e.toIndex, e.itemData),
    });
  }

  itemTemplate = (_card: Card, index: number) => {
    const { files, cards } = this.state;
    return <ListItem
      files={files}
      cards={cards}
      index={index}
      updateCards={this.updateCards}
    />
  }

  updateCards = (cards: Card[]) => {
    this.setState({
      cards,
    });
  }

  onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, cards, inputKey } = this.state;

    const selectedFiles = e.target.files;
    if (selectedFiles === null || selectedFiles.length === 0) return;

    const re = /^(.+[^\d])(\d+)(a|b)?\.(png|jpg)$/;

    const cardSides: CardSide[] = [...files];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      cardSides.push({
        id: fileId++,
        name: file.name,
        file: file,
      });
    }

    const groups: {
      [key: string]: CardListGroup,
    } = {};
    for (const file of cardSides) {
      const match = file.file.name.match(re);
      if (!match) continue;

      const groupName = match[1];
      const index = parseInt(match[2]);
      const side = match[3] === 'b' ? 'back' : 'front';

      const group = groups[groupName] ??= {
        key: groupName,
        items: [],
      };
      const card = group.items[index] ??= {
        id: cardId++,
        count: 1,
      };
      card[side] = file;
    }
    for (const group of Object.values(groups)) {
      if (group.items[0] === undefined) {
        group.items.splice(0, 1);
      }
      for (let i = 0; i < group.items.length; i++) {
        const card = group.items[i] ??= {
          id: cardId++,
          count: 1,
        };
        for (const side of ['front', 'back'] as ('front' | 'back')[]) {
          if (card[side] === undefined) {
            for (let j = i + 1; j < group.items.length; j++) {
              const nextCard = group.items[j] ??= {
                id: cardId++,
                count: 1,
              };
              if (nextCard[side] !== undefined) {
                card[side] = nextCard[side];
                break;
              }
            }
          }
        }
      }
    }

    this.setState({
      files: cardSides,
      cards: Object.values(groups).reduce<Card[]>((list, group) => {
        list.push(...group.items);
        return list;
      }, [...cards]),
      inputKey: inputKey + 1,
    });
  }

  onUpload = async () => {
    const { cards } = this.state;

    const maxValue = cards.reduce<Set<File>>((p, v) => {
      if (v.front) p.add(v.front?.file);
      if (v.back) p.add(v.back?.file);
      return p;
    }, new Set()).size;

    this.setState({
      state: {
        id: 'loading',
        value: 0,
        maxValue,
      },
    });

    const files = new Map<string, CompressedImageData>();
    const data: UploadedImage[] = [];
    try {
      for (const card of cards) {
        const cardData: UploadedImage = {
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
            const uploadedImage = await uploadImage(side, cardSide.file);

            if (this.state.state?.id !== 'loading') return;
            const analysedImage = await analysisImage(side, 0, uploadedImage);

            const compressedImageData = compressImageData(analysedImage, uploadedImage);
            cardData[side] = compressedImageData
            files.set(id, compressedImageData);

            if (this.state.state?.id !== 'loading') return;
            this.setState({
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
          value: data,
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

  onFileSelectClick = () => {
    document.getElementById('image-input')?.click();
  }

  onAddItemsClick = () => {
    this.setState({
      cards: [
        ...this.state.cards,
        {
          id: cardId++,
          count: 1,
        },
      ],
    });
  }

  onClearItemsClick = () => {
    this.setState({
      files: [],
      cards: [],
    });
  }

  hideInfo = () => {
    this.setState({
      state: null,
    });
  }

  render() {
    const { cards, state, inputKey } = this.state;
    console.log(state);
    const loadingState = state?.id === 'loading' ? state : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <input id="image-input" key={inputKey} type="file" multiple={true} accept='.png,.jpg' onChange={this.onSelectFiles} />
        <div style={{ display: 'flex', paddingTop: 8, paddingBottom: 8, }}>
          <Button
            icon={`${chrome.runtime.getURL('icons/select.svg')}`}
            text="Select"
            onClick={this.onFileSelectClick}
          />
          <Button
            icon={`${chrome.runtime.getURL('icons/add.svg')}`}
            text="Add"
            onClick={this.onAddItemsClick}
          />
          <Button
            icon={`${chrome.runtime.getURL('icons/clear.svg')}`}
            text="Clear"
            onClick={this.onClearItemsClick}
          />
          <div style={{ flex: 1 }} />
          <Button
            icon={`${chrome.runtime.getURL('icons/upload.svg')}`}
            text="Upload"
            onClick={this.onUpload}
          />
        </div>
        <List
          selectionMode="none"
          repaintChangesOnly={true}
          dataSource={cards}
          keyExpr="id"
          allowItemDeleting={true}
          itemRender={this.itemTemplate}
        >
          <ItemDragging
            allowReordering={true}
            onDragStart={this.onItemDragStart}
            onAdd={this.onItemAdd}
            onRemove={this.onItemRemove}
            onReorder={this.onItemReorder}>
          </ItemDragging>
        </List>
        <Popup
          visible={loadingState ? true : false}
          shadingColor="rgba(0,0,0,0.4)"
          shading={true}
          title={`Uploading ${((loadingState?.value ?? 0) / (loadingState?.maxValue ?? 1) * 100).toFixed(2)}%`}
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={false}
          width={300}
          height={210}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="center"
            options={{
              text: 'Cancel',
              onClick: this.hideInfo,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', padding: 8, alignItems: 'center' }}>
            <LoadIndicator height={40} width={40} />
            <div className="dx-loadpanel-message">Loading...</div>
          </div>
        </Popup>
        <Popup
          visible={state?.id === 'finished'}
          title="Upload Success"
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showCloseButton={true}
          onHiding={this.hideInfo}
          width={300}
          height={180}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="before"
            options={{
              text: 'Save',
              onClick: () => chrome.runtime.sendMessage({
                message: 'download',
                value: state?.value,
              }),
            }}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={{
              text: 'Close',
              onClick: this.hideInfo,
            }}
          />
        </Popup>
      </div>
    );
  }
}

