import { useState } from 'react'
import Stack from 'react-bootstrap/esm/Stack'
import { Card, CardSide } from '../types/card'
import { Site, Unit } from '../types/mpc'
import { TabProps } from './App'
import CardCount from './CardCount'
import ImageList from './ImageList'
import ImageTabToolbar from './ImageTabToolbar'
import { useModal } from './util'

interface ImageTabProps {
  site: Site
  setTab: (tab: TabProps) => void
}

const ImageTab = ({ site, setTab }: ImageTabProps) => {
  const [unit, setUnit] = useState<Unit>()
  const [files, setFiles] = useState<CardSide[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [modal, setModal, clearModal] = useModal()
  const cardCount = cards.reduce((value, card) => value + card.count, 0)

  return (
    <Stack className='d-flex h-100' gap={2}>
      <ImageTabToolbar
        site={site}
        files={files}
        setFiles={setFiles}
        cards={cards}
        setCards={setCards}
        unit={unit}
        setUnit={setUnit}
        setModal={setModal}
        clearModal={clearModal}
        setTab={setTab}
      />
      <ImageList
        unit={unit}
        files={files}
        cards={cards}
        setCards={setCards}
      />
      <CardCount count={cardCount} unit={unit} />
      {modal}
    </Stack>
  )
}

export default ImageTab
