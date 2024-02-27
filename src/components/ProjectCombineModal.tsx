import { Dispatch, SetStateAction, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { Site } from '../types/mpc'
import { ParsedProject, ProjectCard } from '../types/project'
import { replace } from '../util'
import Stack from 'react-bootstrap/esm/Stack'

interface ProjectCombineModalProps {
  site: Site
  projects: ParsedProject[]
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
  onClose: () => void
}

const ProjectCombineModal = ({ site, projects, setProjects, onClose }: ProjectCombineModalProps) => {
  const groupedProjects = projects.reduce<{ [key: string]: ParsedProject[] }>((group, project) => {
    group[project.code] ??= []
    group[project.code].push(project)
    return group
  }, {})
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
        let combinedCards: ProjectCard[] | null = null
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i]
          const checked = checkedProjects[code][i]
          if (checked) {
            if (combinedCards != null) {
              combinedCards.push(...project.cards)
            } else {
              combinedCards = project.cards
              data.push(project)
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
