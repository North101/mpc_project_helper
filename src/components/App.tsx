import * as React from 'react';

import Tabs from 'devextreme-react/tabs';
import { Popup } from 'devextreme-react/popup';

import "./App.css";
import ProjectTab from './ProjectTab';
import ImagesTab from './ImageTab';

export interface AppProps { }

export interface AppState {
  visible: boolean;
  tabIndex: number;
}

export default class App extends React.Component<AppProps, AppState> {
  static tabs = [
    { id: 0, text: 'Project' },
    { id: 1, text: 'Images' },
  ];

  constructor(props: AppProps) {
    super(props);

    this.state = {
      visible: false,
      tabIndex: 0,
    };

    chrome.runtime.onMessage.addListener((request) => {
      if (request.message === 'show') this.show();
    });
  }

  show = () => {
    this.setState({
      visible: true,
    })
  }

  onTabsSelectionChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      this.setState({
        tabIndex: args.value
      });
    }
  }

  render() {
    const { visible, tabIndex } = this.state;

    return (
      <Popup
        visible={visible}
        title="MPC Project Helper"
        onHiding={() => this.setState({
          visible: false,
        })}
        dragEnabled={false}
        closeOnOutsideClick={false}
        width="90%"
        height="90%"
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Tabs
            dataSource={App.tabs}
            tabIndex={tabIndex}
            onOptionChanged={this.onTabsSelectionChanged}
            focusStateEnabled={true}
          />
          <div className={`tabs ${tabIndex === 0 ? "shown" : ''}`}>
            <ProjectTab />
          </div>
          <div className={`tabs ${tabIndex === 1 ? "shown" : ''}`}>
            <ImagesTab />
          </div>
        </div>
      </Popup>
    );
  }
}