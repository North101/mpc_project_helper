import * as React from "react";
import Modal from "react-bootstrap/esm/Modal";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";

import "./App.css";
import ImageTab from "./ImageTab";
import ProjectTab from "./ProjectTab";

import siteData from '../api/data/site.json';

import 'bootstrap/dist/css/bootstrap.min.css';

interface AppProps { }

interface AppState {
  show: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      show: false,
    };

    chrome.runtime.onMessage.addListener((request) => {
      if (request.message === 'show') this.show();
    });
  }

  show = () => {
    this.setState({
      show: true,
    });
  }

  onClose = () => {
    this.setState({
      show: false,
    });
  }

  render() {
    const { show } = this.state;
    console.log(siteData, location.origin);
    const siteCode = siteData.find((site) => site.url === location.origin)!.code;
    return (
      <Modal show={show} centered={true} scrollable={true} onHide={this.onClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>MPC Project Helper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="project" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="project" title="Project">
              <ProjectTab siteCode={siteCode} />
            </Tab>
            <Tab eventKey="images" title="Images">
              <ImageTab siteCode={siteCode} />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}