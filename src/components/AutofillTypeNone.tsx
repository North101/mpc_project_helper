import { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { Card, CardSide } from '../types/card'

export interface AutofillNoneProps {
  cardSides: CardSide[]
  onChange: (cards: Card[]) => void
}

export const AutofillNone = ({ onChange }: AutofillNoneProps) => {
  useEffect(() => onChange([]), [])

  return (
    <Form.Text>You're on your own</Form.Text>
  )
}

export interface AutofillType {
  id: string
  name: string
}

const autofillTypeNone: AutofillType = {
  id: 'none',
  name: 'No Autofill',
}
export default autofillTypeNone
