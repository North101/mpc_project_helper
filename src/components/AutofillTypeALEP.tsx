import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/esm/Accordion'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import { v4 as uuid } from 'uuid'
import { Card, CardFace } from '../types/card'
import { AutofillNoneProps, AutofillType } from './AutofillTypeNone'

const sideMap: { [key: string]: CardFace } = {
  '1': 'front',
  '2': 'back',
}

const authenticityData = [
  {
    id: 'o',
    name: 'Official',
  },
  {
    id: 'u',
    name: 'Unofficial',
  },
]

export const AutofillALeP = ({ cardSides, onChange }: AutofillNoneProps) => {
  const cardMatcher = /^(.+\-)(?:(1|2)(u|o))\.(png|jpg)$/
  const [backAuthenticity, setBackAuthenticity] = useState(authenticityData[1])

  const onBackAuthenticityChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const backAuthenticity = authenticityData.find(it => `${it.id}` === event.currentTarget.value)
    if (!backAuthenticity) return

    setBackAuthenticity(backAuthenticity)
  }

  useEffect(() => {
    const groups: {
      [key: string]: Card
    } = {}
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(cardMatcher)
      if (!match) continue

      const groupName = match[1]
      const side = sideMap[match[2].toLowerCase()]
      if (!side) continue

      const authenticityId = match[3].toLowerCase()
      if (side === 'back' && backAuthenticity.id !== authenticityId) continue

      const card = groups[groupName] ?? {
        id: uuid(),
        count: 1,
      }
      if (side === 'front') {
        card.front = cardSide
      } else if (side === 'back') {
        card.back = cardSide
      } else {
        continue
      }
      groups[groupName] = card
    }

    onChange(Object.values(groups))
  }, [backAuthenticity])

  return (
    <div className='d-flex flex-column gap-2'>
      <Accordion>
        <Accordion.Item eventKey='0'>
          <Accordion.Header className='p-0'>Description</Accordion.Header>
          <Accordion.Body>
            <p>An autofill for A Long-extended Party, an unofficial community run project that makes makes player cards and quests for the Lord of the Rings: The Card Game</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className='d-flex gap-2'>
        <FloatingLabel label='Back Authenticity' className='flex-fill'>
          <Form.Select value={backAuthenticity.id} onChange={onBackAuthenticityChange}>
            {authenticityData.map(it => (
              <option key={it.id} value={it.id}>{it.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </div>
    </div >
  )
}

const autofillTypeALeP: AutofillType = {
  id: 'alep',
  name: 'ALeP',
}
export default autofillTypeALeP
