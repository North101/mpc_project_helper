import { Dispatch, SetStateAction, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { ParsedProject } from '../types/project'
import { replace } from '../util'

interface ProjectCombineModalProps {
  projects: ParsedProject[]
  setProjects: Dispatch<SetStateAction<ParsedProject[]>>
  onClose: () => void
}

const ProjectCombineModal = ({ projects, setProjects, onClose }: ProjectCombineModalProps) => {
  const [checked, setChecked] = useState<boolean[]>(() => projects.map(() => true))

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const checked = event.currentTarget.checked
    setChecked(prevState => replace(prevState, index, checked))
  }

  const onCombine = () => {
    setProjects(prevState => {
      const combinedProject = prevState.reduce<ParsedProject | undefined>((value, project, index) => {
        if (!checked[index]) return value

        return value ? {
          ...value,
          cards: [
            ...value.cards,
            ...project.cards,
          ]
        } : project
      }, undefined)
      if (!combinedProject) return prevState

      const index = checked.findIndex(e => e)
      const projects = prevState.filter((_, index) => !checked[index]).slice()
      return [
        ...projects.slice(0, index),
        combinedProject,
        ...projects.slice(index)
      ]
    })
    onClose()
  }

  return (
    <Modal show centered scrollable>
      <Modal.Header>Combine</Modal.Header>
      <Modal.Body>
        {projects.map((e, index) => <Form.Check
          key={e.id}
          type='checkbox'
          label={e.name}
          checked={checked[index]}
          onChange={(e) => onChange(e, index)}
        />)}
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
          disabled={checked.every(e => !e)}
        >
          Combine
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectCombineModal
