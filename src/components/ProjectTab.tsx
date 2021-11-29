import * as React from "react";

import { Button } from "devextreme-react/button";
import { List, ItemDragging } from "devextreme-react/list";
import { LoadPanel } from "devextreme-react/load-panel";
import { Popup, ToolbarItem } from "devextreme-react/popup";

import { createProject, Settings, UploadedImage } from "../api/mpc_api";

const ItemTemplate = (file: File, index: number) => {
  return <div>{file.name}</div>;
}

export interface ProjectTabProps {
  settings: Settings;
}

export interface ProjectTabState {
  files: File[];
  state: null | { id: 'loading', value: number } | { id: 'finished', value: string } | { id: 'error', value: any };
}

export default class ProjectTab extends React.Component<ProjectTabProps, ProjectTabState> {
  constructor(props: ProjectTabProps) {
    super(props);

    this.state = {
      files: [],
      state: null,
    }
  }

  onItemDragStart = (e: any) => {
    e.itemData = this.state.files[e.fromIndex];
  }

  onItemAdd = (e: any) => {
    const files = this.state.files;
    this.setState({
      files: [
        ...files.slice(0, e.toIndex),
        e.itemData, ...files.slice(e.toIndex),
      ],
    });
  }

  onItemRemove = (e: any) => {
    const files = this.state.files;
    this.setState({
      files: [
        ...files.slice(0, e.fromIndex),
        ...files.slice(e.fromIndex + 1),
      ],
    });
  }

  onItemReorder = (e: any) => {
    this.onItemRemove(e);
    this.onItemAdd(e);
  }

  onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;

    const files = [
      ...this.state.files,
    ];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }

    this.setState({
      files: files,
    });
  }

  onUpload = async () => {
    const { settings } = this.props;
    const { files } = this.state;

    this.setState({
      state: {
        id: 'loading',
        value: 0,
      },
    });

    try {
      const cards: UploadedImage[] = [];
      for (const file of files) {
        cards.push(...JSON.parse(await file.text()));
      }
      const projectUrl = await createProject(settings, cards);

      this.setState({
        files: [],
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

  onClear = () => {
    this.setState({
      files: [],
    });
  }

  hideInfo = () => {
    this.setState({
      state: null,
    });
  }

  render() {
    const { files, state } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <input id="project-input" type="file" multiple={true} accept='.txt' onChange={this.onSelectFiles} />
        <div style={{ display: 'flex', justifyContent: 'end', paddingTop: 8, paddingBottom: 8, }}>
          <Button
            icon={`${chrome.runtime.getURL('icons/select.svg')}`}
            text="Select"
            onClick={() => {
              document.getElementById('project-input')?.click();
            }}
          />
          <Button
            icon={`${chrome.runtime.getURL('icons/clear.svg')}`}
            text="Clear"
            onClick={this.onClear}
          />
          <div style={{ flex: 1 }} />
          <Button
            icon={`${chrome.runtime.getURL('icons/upload.svg')}`}
            text="Upload"
            onClick={this.onUpload}
          />
        </div>
        <List
          dataSource={files}
          keyExpr="name"
          repaintChangesOnly={true}
          allowItemDeleting={true}
          itemRender={ItemTemplate}
        >
          <ItemDragging
            allowReordering={true}
            group="files"
            data="files"
            onDragStart={this.onItemDragStart}
            onAdd={this.onItemAdd}
            onRemove={this.onItemRemove}
            onReorder={this.onItemReorder}>
          </ItemDragging>
        </List>
        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={state?.id === 'loading'}
          showIndicator={true}
          shading={true}
          showPane={true}
          closeOnOutsideClick={false}
        />
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
              text: 'Open',
              onClick: () => chrome.runtime.sendMessage({
                message: 'open',
                url: state?.value,
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
      </div >
    );
  }
}