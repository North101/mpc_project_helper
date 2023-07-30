import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Project } from "../types/project";

interface SaveProjectButtonProps {
  project: Project;
}

export default class SaveProjectButton extends React.Component<SaveProjectButtonProps> {
  onSave = async () => {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'project.json',
      types: [
        {
          description: "Project file",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
    });
    const writable = await handle.createWritable();

    await writable.write(JSON.stringify(this.props.project));
    await writable.close();
  }

  render() {
    return (
      <Button
        style={{ width: '80%', margin: '0 auto', }}
        variant="success"
        onClick={this.onSave}
      >
        Save as Project
      </Button>
    )
  }
}
