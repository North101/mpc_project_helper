import * as React from 'react';
import "./App.css";

import List, { ItemDragging } from 'devextreme-react/list';
import './mpc_api';
import createProject from './mpc_api';

class App extends React.Component<{}, {
  files: File[];
  uploading: boolean;
  projectUrl: string | null;
}> {
  constructor(props: {}) {
    super(props);

    this.state = {
      files: [],
      uploading: false,
      projectUrl: null,
    };
    this.state.files
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

  onItemRender = (file: File, index: number) => {
    return <div>{file.name}</div>;
  }

  onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;

    const files = [
      ...this.state.files,
    ];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }
    console.log(files);

    this.setState({
      files: files,
    });
  }

  onUpload = async () => {
    const { files } = this.state;

    this.setState({
      uploading: true,
    });

    try {
      const cards = [];
      for (const file of files) {
        cards.push(...JSON.parse(await file.text()));
      }
      const projectUrl = await createProject({
        cardStock: 'PA_014',
        printType: '',
        finish: 'PPR_0009',
        packaging: 'PB_043',
      }, cards);

      this.setState({
        files: [],
        uploading: false,
        projectUrl,
      });
    } catch (e) {
      this.setState({
        uploading: false,
      });
      return;
    }
  }

  closeProjectUrl = () => {
    this.setState({
      projectUrl: null,
    });
  }

  render() {
    const { files, uploading, projectUrl } = this.state;
    return (
      <div className="widget-container">
        <div style={{ display: 'flex', alignSelf: 'end', }}>
          <div className="image-upload">
            <button className="icon-button" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById('file-input')?.click();
            }}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.5 16H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h12.5c1.38 0 2.5 1.12 2.5 2.5S20.88 13 19.5 13H9c-.55 0-1-.45-1-1s.45-1 1-1h9.5V9.5H9c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h10.5c2.21 0 4-1.79 4-4s-1.79-4-4-4H7c-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5h11.5V16z" /></svg>
            </button>
            <input id="file-input" type="file" multiple={true} accept='.json' onChange={this.onSelectFiles} />
          </div>
          <button className="icon-button" onClick={this.onUpload}>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" /></svg>
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <List
            dataSource={files}
            keyExpr="name"
            repaintChangesOnly={true}
            allowItemDeleting={true}>
            itemRender={this.onItemRender}
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
        </div>
        {uploading && (
          <div className="modal">
            <div className="container">
              <progress className="pure-material-progress-circular" /> Uploading...
            </div>
          </div>
        )}
        {projectUrl && (
          <div className="modal">
            <div className="container">
              <a href="#" onClick={() => chrome.tabs.create({ url: projectUrl })}>
                Open Project
              </a>
              <a href="#" onClick={this.closeProjectUrl} style={{ fontSize: 'small' }}>
                Close
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;