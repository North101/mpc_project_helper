import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/esm/Accordion'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { v4 as uuid } from 'uuid'
import { Card, CardFace, CardFaces, CardSide } from '../types/card'
import { AutofillNoneProps, AutofillType } from './AutofillTypeNone'

const sideMap: { [key: string]: CardFace } = {
  '1': 'front',
  'front': 'front',
  'a': 'front',
  '2': 'back',
  'back': 'back',
  'b': 'back',
}

const sideData: {
  id: CardFace
  name: string
}[] = [
    {
      id: 'front',
      name: 'Front',
    },
    {
      id: 'back',
      name: 'Back',
    },
  ]

export const FilenameTooltip = (props: any) => {
  return (
    <OverlayTrigger
      placement='auto'
      overlay={<Tooltip>{props.children}</Tooltip>}
    >
      <span className='filename-part'>{props.text}</span>
    </OverlayTrigger>
  )
}

export const AutofillBasic = ({ cardSides, onChange }: AutofillNoneProps) => {
  const cardMatcher = /^((.+?(?:(?:\s|\-|_|\.)x(\d+))?)(?:(?:(?:\s|\-|_|\.)(front|back|[AaBb12]))|((?<=\d)[AaBb])))?\.(png|jpg)$/
  const defaultFrontMatcher = /^front.(png|jpg)$/
  const defaultBackMatcher = /^back.(png|jpg)$/

  const [defaultSide, setDefaultSide] = useState<CardFace>()
  const [defaultFront, setDefaultFront] = useState<CardSide | undefined>(() => {
    return cardSides.find(it => it.file.name.match(defaultFrontMatcher))
  })
  const [defaultBack, setDefaultBack] = useState<CardSide | undefined>(() => {
    return cardSides.find(it => it.file.name.match(defaultBackMatcher))
  })

  const onDefaultSideChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setDefaultSide(sideData.find(it => it.id === event.currentTarget.value)?.id)
  }

  const onDefaultFrontChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setDefaultFront(cardSides.find(it => it.id === event.currentTarget.value))
  }

  const onDefaultBackChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setDefaultBack(cardSides.find(it => it.id === event.currentTarget.value))
  }

  useEffect(() => {
    const groups: {
      [key: string]: Card
    } = {}
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(cardMatcher)
      if (!match) continue

      const name = match[1]
      if (CardFaces.includes(name as CardFace)) continue

      const groupName = match[2]
      const count = parseInt(match[3]) || 1
      const side = sideMap[(match[4] ?? match[5])?.toLowerCase()] ?? defaultSide
      if (!side) continue

      const card = groups[groupName] ?? {
        id: uuid(),
        front: defaultFront,
        back: defaultBack,
        count,
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
  }, [defaultSide, defaultFront, defaultBack])

  return (
    <div className='d-flex flex-column gap-2'>
      <Accordion>
        <Accordion.Item eventKey='0'>
          <Accordion.Header className='p-0'>Description</Accordion.Header>
          <Accordion.Body>
            <p>A basic autofill that will match front and back images and (optionally) a count</p>
            <p>
              <span>An image with the filename </span>
              <span style={{ color: 'blue'}} className='text-decoration-underline'>
                <FilenameTooltip text={'<side>'}>
                  <span className='fw-bold'>Required</span><br />
                  side: front, back
                </FilenameTooltip>
                <FilenameTooltip text={'.<ext>'}>
                  <span className='fw-bold'>Required</span><br />
                  ext: .png, .jpg
                </FilenameTooltip>
              </span>
              <span> will be automatically set as the default front or back image</span>
            </p>
            <p>
              <span>Filename structure (hover for more info): </span>
              <span style={{ color: 'blue'}} className='text-decoration-underline'>
                <FilenameTooltip text={'<anything>'}>
                  Literally anything
                </FilenameTooltip>
                <FilenameTooltip text={'-x<count>'}>
                  <span className='fw-bold'>Optional</span><br />
                  seperator: -, _, ., {'<space>'}<br />
                  count: number. the number of times you want this duplicated in the project
                </FilenameTooltip>
                <FilenameTooltip text={'-<side>'}>
                  <span className='fw-bold'>Optional (default: front)</span><br />
                  seperator: -, _, ., {'<space>'}<br />
                  side:<br />
                  <ul>
                    <li>front, 1, a: will be assigned as the front image</li>
                    <li>back, 2, b: will be assigned as the back image</li>
                  </ul>
                </FilenameTooltip>
                <FilenameTooltip text={'.<ext>'}>
                  <span className='fw-bold'>Required</span><br />
                  ext: .png, .jpg
                </FilenameTooltip>
              </span>
            </p>
            <div>
              e.g.<br />
              <ul>
                <li>
                  <span style={{ color: 'blue'}} className='text-decoration-underline'>
                    01-card
                    <FilenameTooltip text={'-x2'}>
                      <span className='fw-bold'>{'-x<count>'}</span><br />
                      Sets the count to 2
                    </FilenameTooltip>
                    <FilenameTooltip text={'-front'}>
                      <span className='fw-bold'>{'-<side>'}</span><br />
                      This is the front image for 01-card-x2
                    </FilenameTooltip>
                    <FilenameTooltip text={'.jpg'}>
                      <span className='fw-bold'>{'.<ext>'}</span><br />
                      The file type
                    </FilenameTooltip>
                  </span>
                </li>
                <li>
                  <span style={{ color: 'blue'}} className='text-decoration-underline'>
                    01-card
                    <FilenameTooltip text={'-x2'}>
                      <span className='fw-bold'>{'-<count>'}</span><br />
                      Sets the count to 2
                    </FilenameTooltip>
                    <FilenameTooltip text={'-back'}>
                      <span className='fw-bold'>{'-<side>'}</span><br />
                      This is the back image for 01-card-x2
                    </FilenameTooltip>
                    <FilenameTooltip text={'.png'}>
                      <span className='fw-bold'>{'.<ext>'}</span><br />
                      The file type
                    </FilenameTooltip>
                  </span>
                </li>
                <li>
                  <span style={{ color: 'blue'}} className='text-decoration-underline'>
                    my-filename
                    <FilenameTooltip text={'-front'}>
                      <span className='fw-bold'>{'-<side>'}</span><br />
                      This is the front image for my-filename
                    </FilenameTooltip>
                    <FilenameTooltip text={'.png'}>
                      <span className='fw-bold'>{'.<ext>'}</span><br />
                      The file type
                    </FilenameTooltip>
                  </span>
                </li>
                <li>
                  <span style={{ color: 'blue'}} className='text-decoration-underline'>
                    my-filename
                    <FilenameTooltip text={'-back'}>
                      <span className='fw-bold'>{'-<side>'}</span><br />
                      This is the back image for my-filename
                    </FilenameTooltip>
                    <FilenameTooltip text={'.png'}>
                      <span className='fw-bold'>{'.{ext>'}</span><br />
                      The file type
                    </FilenameTooltip>
                  </span>
                </li>
              </ul>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className='d-flex gap-2'>
        <FloatingLabel label='Default Side' className='flex-fill'>
          <Form.Select value={defaultSide} onChange={onDefaultSideChange}>
            <option>None</option>
            {sideData.map(it => (
              <option key={it.id} value={it.id}>{it.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel label='Default Front' className='flex-fill'>
          <Form.Select value={defaultFront?.id} onChange={onDefaultFrontChange}>
            <option>None</option>
            {cardSides.map(it => (
              <option key={it.id} value={it.id}>{it.file.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel label='Default Back' className='flex-fill'>
          <Form.Select value={defaultBack?.id} onChange={onDefaultBackChange}>
            <option>None</option>
            {cardSides.map(it => (
              <option key={it.id} value={it.id}>{it.file.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </div>
    </div >
  )
}

const autofillTypeBasic: AutofillType = {
  id: 'basic',
  name: 'Basic',
}
export default autofillTypeBasic
