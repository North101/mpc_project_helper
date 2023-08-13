import React, { useState } from 'react'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { Card } from '../types/card'
import { Site, Unit } from '../types/mpc'
import CardPreview from './CardPreview'


interface CardPreviewModalProps {
  site: Site
  unit?: Unit
  cards: Card[]
  onClose: () => void
}

const CardPreviewModal = ({ site, unit: initialUnit, cards, onClose }: CardPreviewModalProps) => {
  const [unit, setUnit] = useState<Unit | undefined>(initialUnit ?? site.unitList.at(0))

  const onUnitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value
    setUnit(site.unitList.find(it => it.code === unitCode))
  }

  return (
    <Modal show fullscreen centered onHide={onClose} className='mpc-project-helper-dialog'>
      <Modal.Header closeButton>Card Preview</Modal.Header>
      <Modal.Body className='d-flex flex-column gap-2 justify-content-between overflow-hidden'>
        <FloatingLabel controlId='floatingSelect1' label='Product'>
          <Form.Select aria-label='Product' value={unit?.code} onChange={onUnitChange}>
            <optgroup label='Recomended'>
              {site.unitList.filter(it => it.curated !== null).map(it => (
                <option key={it.code} value={it.code}>{it.name}</option>
              ))}
            </optgroup>
            <optgroup label='Other'>
              {site.unitList.filter(it => it.curated === null).map(it => (
                <option key={it.code} value={it.code}>{it.name}</option>
              ))}
            </optgroup>
          </Form.Select>
        </FloatingLabel>
        {unit && <div className='d-flex flex-fill flex-wrap gap-2 overflow-scroll'>
          {cards.flatMap(e => Array<Card>(e.count).fill(e)).map((it, index) => <CardPreview
            key={index}
            height={unit.height}
            width={unit.width}
            card={it}
          />)}
        </div>}
      </Modal.Body>
    </Modal>
  )
}

export default CardPreviewModal
