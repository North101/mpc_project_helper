import { Dispatch, SetStateAction, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import { replace } from '../util'
import Stack from 'react-bootstrap/esm/Stack'

interface ProjectCombineModalProps {
  site: Site
  projects: {
    [key: string]: ParsedProject[]
  }
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
  onClose: () => void
}

const ProjectCombineModal = ({ site, projects: groupedProjects, setProjects, onClose }: ProjectCombineModalProps) => {
  const [checkedProjects, setCheckedProjects] = useState(() => {
    return Object.fromEntries(Object.entries(groupedProjects).map(([key, value]) => {
      return [key, value.map(() => true)]
    }))
  })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, code: string, index: number) => {
    const checked = event.currentTarget.checked
    setCheckedProjects(prevState => ({
      ...prevState,
      [code]: replace(prevState[code], index, checked),
    }))
  }

  const onCombine = () => {
    setProjects(_ => {
      const data: ParsedProject[] = []
      for (const [code, projects] of Object.entries(groupedProjects)) {
        let combined: number | null = null
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i]
          const checked = checkedProjects[code][i]
          if (checked) {
            if (combined != null) {
              data[combined] = {
                ...data[combined],
                cards: [
                  ...data[combined].cards,
                  ...project.cards,
                ],
              }
            } else {
              combined = data.push(project) - 1
            }
          } else {
            data.push(project)
          }
        }
      }
      return data
    })
    onClose()
  }

  return (
    <Modal show centered scrollable>
      <Modal.Header>Combine</Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          {Object.entries(groupedProjects).map(([code, projects]) => (
            <Card key={code}>
              <Card.Body>
                <Card.Title>{site.unitList.find(e => e.code == code)?.name ?? 'Unknown'}</Card.Title>
                <Card.Text>
                  {projects.map((e, index) => <Form.Check
                    key={e.id}
                    type='checkbox'
                    label={e.name}
                    checked={checkedProjects[code][index]}
                    onChange={(e) => onChange(e, code, index)}
                  />)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant='primary'
          onClick={onCombine}
          disabled={!Object.values(checkedProjects).some((value) => value.some(e => e))}
        >
          Combine
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectCombineModal
