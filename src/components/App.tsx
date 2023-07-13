import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react";
import Modal from "react-bootstrap/esm/Modal";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import siteData from '../api/data/site.json';
import "./App.css";
import ImageTab from "./ImageTab";
import ProjectTab from "./ProjectTab";

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

  render() {
    const { show } = this.state;
    const site = siteData.find((site) => site.urls.includes(location.origin));
    return (
      <Modal show={show} fullscreen centered onHide={this.onClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title>MPC Project Helper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {site ? (
            <Tabs defaultActiveKey="project" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="project" title="Project">
                <ProjectTab site={site} />
              </Tab>
              <Tab eventKey="images" title="Images">
                <ImageTab site={site} />
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
