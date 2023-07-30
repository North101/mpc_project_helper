import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react";
import Modal from "react-bootstrap/esm/Modal";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import siteData from '../api/data/site.json';
import { ParsedProject } from '../types/project';
import "./App.css";
import ImageTab from "./ImageTab";
import ProjectTab from "./ProjectTab";
import { Site } from '../types/mpc';

interface AppProps { }

interface AppState {
  show: boolean;
  tab?: ProjectTabSettings | ImageTabSettings;
}

export interface ProjectTabSettings {
  id: 'project';
  items: ParsedProject[];
}

export interface ImageTabSettings {
  id: 'image',
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.onShow);
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.onShow)
  }

  onShow = (request: { message: string }) => {
    if (request.message !== 'show') return;

    this.setState({
      show: true,
    });
  }

  onClose = () => {
    this.setState({
      show: false,
    });
  }

  onSetTab = (tab?: ProjectTabSettings | ImageTabSettings) => {
    this.setState({
      tab: tab,
    })
  }

  onTabChange = () => {
    this.setState({
      tab: undefined,
    })
  }

  render() {
    const { show, tab } = this.state;
    const data = siteData.find(site => site.urls.includes(location.origin));
    const site = data ? new Site(data) : null;
    return (
      <Modal show={show} fullscreen centered onHide={this.onClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>MPC Project Helper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {site ? (
            <Tabs
              id="tabs"
              activeKey={tab?.id}
              defaultActiveKey="project"
              className="mb-3"
              onSelect={this.onTabChange}
            >
              <Tab eventKey="project" title="Project">
                <ProjectTab
                  site={site}
                  items={tab?.id == 'project' ? tab.items : undefined}
                  onSetTab={this.onSetTab}
                />
              </Tab>
              <Tab eventKey="images" title="Images">
                <ImageTab
                  site={site}
                  onSetTab={this.onSetTab}
                />
              </Tab>
            </Tabs>
          ) : (
            <div>
              MPC Project Helper is not compatible with {location.origin}
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}
