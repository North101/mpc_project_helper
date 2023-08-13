import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { Card, CardSide } from '../types/card'
import AutofillCardList from './AutofillCardList'
import autofillTypeALeP, { AutofillALeP } from './AutofillTypeALEP'
import autofillTypeBasic, { AutofillBasic } from './AutofillTypeBasic'
import autofillTypeNone, { AutofillNone, AutofillType } from './AutofillTypeNone'

interface AutofillModalProps {
  cardSides: CardSide[]
  onAdd: (cardSides: CardSide[], cards: Card[]) => void
  onClose: () => void
}

const autofillOptions = [
  autofillTypeNone,
  autofillTypeBasic,
  autofillTypeALeP,
]

const AutofillModal = ({ cardSides, onAdd, onClose }: AutofillModalProps) => {
  const [autofill, setAutofill] = useState<AutofillType>(autofillTypeBasic)
  const [cards, setCards] = useState<Card[]>([])

  const onAutofillChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const autofill = autofillOptions.find(it => it.id === event.currentTarget.value)
    if (autofill === undefined) return

    setAutofill(autofill)
  }

  const onChange = (cards: Card[]) => setCards(cards)

  let autofillView: JSX.Element | undefined = undefined
  if (autofill.id === 'none') {
    autofillView = <AutofillNone cardSides={cardSides} onChange={onChange} />
  } else if (autofill.id === 'basic') {
    autofillView = <AutofillBasic cardSides={cardSides} onChange={onChange} />
  } else if (autofill.id === 'alep') {
    autofillView = <AutofillALeP cardSides={cardSides} onChange={onChange} />
  }

  return (
    <Modal show centered fullscreen onHide={onClose} className='mpc-project-helper-dialog'>
      <Modal.Header closeButton>Autofill Options</Modal.Header>
      <Modal.Body>
        <div className='d-flex flex-column gap-2 flex-fill'>
          <FloatingLabel label='Autotfill'>
            <Form.Select aria-label='Autotfill' value={autofill.id} onChange={onAutofillChange}>
              {autofillOptions.map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <div className='d-flex flex-column gap-2 overflow-scroll'>
            {autofillView}
            <AutofillCardList cards={cards} onChange={onChange} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>Close</Button>
        <Button onClick={() => onAdd(cardSides, cards)}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AutofillModal
