import Button from 'react-bootstrap/esm/Button'
import { ParsedProject } from '../types/project'
import { Latest } from '../types/projects'

interface SaveProjectButtonProps {
  projects: ParsedProject[]
}

const SaveProjectButton = ({ projects }: SaveProjectButtonProps) => {
  const onSave = async () => {
    const download: Latest.Project = {
      version: 3,
      parts: projects.map(e => ({
        code: e.code,
        name: e.name,
        cards: e.cards.map(e => ({
          ...e,
          front: e.front ? ({
            ...e.front,
            Name: e.front.Name ?? e.front.ID,
          }) : undefined,
          back: e.back ? ({
            ...e.back,
            Name: e.back.Name ?? e.back.ID,
          }) : undefined,
        })),
      })),
    }

    const handle = await window.showSaveFilePicker({
      suggestedName: 'project.json',
      types: [
        {
          description: 'Project file',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    })
    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(download))
    await writable.close()
  }

  return (
    <Button
      className='w-75'
      variant='success'
      onClick={onSave}
    >
      Save as Project
    </Button>
  )
}

export default SaveProjectButton
