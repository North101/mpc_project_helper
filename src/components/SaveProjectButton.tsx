import Button from 'react-bootstrap/esm/Button'
import { ParsedProject, ProjectV2 } from '../types/project'

interface SaveProjectButtonProps {
  projects: ParsedProject[]
}

const SaveProjectButton = ({ projects }: SaveProjectButtonProps) => {
  const onSave = async () => {
    const download: ProjectV2 = {
      version: 2,
      code: projects[0].code,
      parts: projects.map(e => ({
        name: e.name,
        cards: e.cards,
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
