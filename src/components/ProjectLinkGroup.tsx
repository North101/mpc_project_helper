import React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";

interface ProjectLinkGroupProps {
  urls: string[];
}

export default class ProjectLinkGroup extends React.Component<ProjectLinkGroupProps, {}> {
  render() {
    const { urls } = this.props;
    return (
      <div>
        <p>Your project(s) were successfully uploaded</p>
        <Alert variant="warning">
          <Alert.Heading>Warning</Alert.Heading>
          <p>MPC Project Helper is reverse engineered and makes no guaranties that it is bug free or that {location.origin} will not make changes that will break it.</p>
          <hr />
          <p>Always check the uploaded project and its images before purchasing.</p>
        </Alert>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonGroup className="d-flex button-group" vertical style={{ width: '80%' }}>
            {urls.map((url, index) => <Button
              key={index}
              variant="primary"
              href={url}
              target="_blank"
            >
              {`Open Project (${index + 1}/${urls.length})`}
            </Button>)}
          </ButtonGroup>
        </div>
      </div>
    )
  }
}
