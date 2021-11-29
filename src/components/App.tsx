import * as React from 'react';

import Tabs from 'devextreme-react/tabs';
import { Popup } from 'devextreme-react/popup';

import "./App.css";
import ProjectTab from './ProjectTab';
import ImagesTab from './ImageTab';
import { Settings } from '../api/mpc_api';

export interface AppProps { }

export interface AppState {
  visible: boolean;
  tabIndex: number;
  settings: Settings;
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
      settings: {
        url: 'https://www.makeplayingcards.com',
        unit: 'C380050185D1C1AF',
        product: 'FI_7999',
        frontDesign: 'FP_031273',
        backDesign: 'FP_031272',
        cardStock: 'PA_014',
        printType: '',
        finish: 'PPR_0009',
        packaging: 'PB_043',

        // url: 'https://www.printerstudio.co.uk',
        // unit: '6229BAC504DC5BB4',
        // product: 'FI_569',
        // frontDesign: 'FP_000441',
        // backDesign: 'FP_012232',
        // cardStock: 'PA_007',
        // printType: '',
        // finish: 'PPR_0009',
        // packaging: 'PB_018',
      },
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
    const { visible, tabIndex, settings } = this.state;

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
            <ProjectTab settings={settings} />
          </div>
          <div className={`tabs ${tabIndex === 1 ? "shown" : ''}`}>
            <ImagesTab settings={settings} />
          </div>
        </div>
      </Popup>
    );
  }
}