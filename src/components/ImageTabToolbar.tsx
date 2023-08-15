import { CardSettings, CompressedImageData, Settings, UploadedImage, analysisImage, compressImageData, createAutoSplitProject, uploadImage } from 'mpc_api'
import { Dispatch, SetStateAction, useId, useRef } from 'react'
import { CardImage, FileEarmarkPlus, PlusCircle, Upload, XCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import Stack from 'react-bootstrap/esm/Stack'
import { v4 as uuid } from 'uuid'
import { Card, CardFaces, CardSide } from '../types/card'
import { Site, Unit } from '../types/mpc'
import { analyseCard } from '../util'
import { TabProps } from './App'
import AutofillModal from './AutofillModal'
import CardPreviewModal from './CardPreviewModal'
import ErrorModal from './ErrorModal'
import ImageSettingsModal from './ImageSettingsModal'
import ProgressModal from './ProgressModal'
import SuccessModal from './SuccessModal'

interface AddButtonProps {
  onAddCards: (files: CardSide[], cards: Card[]) => void
  setModal: Dispatch<SetStateAction<JSX.Element | undefined>>
  clearModal: () => void
}

const AddButton = ({ onAddCards, setModal, clearModal }: AddButtonProps) => {
  const ref = useRef<HTMLInputElement>(null)

  const onOpenFiles = () => ref?.current?.click()

  const onAdd = async (e: React.FormEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files
    const total = selectedFiles?.length
    if (!total) return

    const key = uuid()
    setModal(<ProgressModal
      key={key}
      title='Analysing images...'
      value={0}
      maxValue={total}
      onClose={clearModal}
    />)

    let count = 0
    const promiseList: Promise<CardSide>[] = []
    for (let i = 0; i < total; i++) {
      promiseList.push(analyseCard(selectedFiles[i]).then(({ file, width, height }) => ({
        id: uuid(),
        file: file,
        info: {
          width,
          height,
        },
      })).then(it => {
        setModal(prevState => {
          if (prevState?.key != key) return prevState

          return <ProgressModal
            key={key}
            title='Analysing images...'
            value={++count}
            maxValue={total}
            onClose={clearModal}
          />
        })
        return it
      }))
    }

    const cardSides = await Promise.all(promiseList)
    cardSides.sort((a, b) => {
      return a.file.name.localeCompare(b.file.name)
    })
    setModal(prevState => {
      if (prevState?.key != key) return prevState

      return <AutofillModal
        cardSides={cardSides}
        onAdd={onAddCards}
        onClose={clearModal}
      />
    })
  }

  return (
    <>
      <input
        id='project-input'
        className='d-none'
        key={useId()}
        ref={ref}
        type='file'
        multiple
        accept='.png, .jpg'
        onChange={onAdd}
      />
      <Button variant='outline-primary' onClick={onOpenFiles}>
        <FileEarmarkPlus /> Add cards
      </Button>
    </>
  )
}

interface UploadButtonProps {
  site: Site
  cards: Card[]
  setModal: Dispatch<SetStateAction<JSX.Element | undefined>>
  clearModal: () => void
  setTab: (tab: TabProps) => void
}

const UploadButton = ({ site, cards, setModal, clearModal, setTab }: UploadButtonProps) => {
  const uploadCards = async (settings: CardSettings, cards: Card[]) => {
    const maxValue = cards.reduce<Set<File>>((p, v) => {
      if (v.front) p.add(v.front?.file)
      if (v.back) p.add(v.back?.file)
      return p
    }, new Set()).size

    const key = uuid()
    setModal(<ProgressModal
      key={key}
      title='Uploading...'
      value={0}
      maxValue={maxValue}
      onClose={clearModal}
    />)

    const files = new Map<string, CompressedImageData>()
    const data: UploadedImage[] = []
    for (const card of cards) {
      const cardData: UploadedImage = {
        count: card.count,
      }
      for (const side of CardFaces) {
        const cardSide = card[side]
        if (!cardSide) continue

        const id = `${cardSide.id}-${side}`
        if (files.has(id)) {
          cardData[side] = files.get(id)
        } else {
          const uploadedImage = await uploadImage(settings, side, cardSide.file)
          const analysedImage = await analysisImage(settings, side, 0, uploadedImage)

          const compressedImageData = {
            Name: cardSide.file.name,
            ...compressImageData(analysedImage, uploadedImage),
          }
          cardData[side] = compressedImageData
          files.set(id, compressedImageData)

          setModal(prevState => {
            if (prevState?.key != key) return prevState

            return <ProgressModal
              key={key}
              title='Uploading...'
              value={files.size}
              maxValue={maxValue}
              onClose={clearModal}
            />
          })
        }
      }
      data.push(cardData)
    }

    return data
  }

  const onCardUpload = async (name: string, settings: CardSettings, cards: Card[]) => {
    try {
      const data = await uploadCards(settings, cards)
      if (data === undefined) return

      const projects = [{
        id: uuid(),
        name: name,
        code: settings.unit,
        unit: site.unitList.find(e => e.code == settings.unit)!,
        cards: data.map(card => ({
          id: uuid(),
          ...card,
        })),
      }]
      setModal(<SuccessModal
        message='Your images were successfully uploaded'
        projects={projects}
        onLoadProject={() => setTab({
          id: 'project',
          projects: projects,
        })}
        onClose={clearModal}
      />)
      return
    } catch (e) {
      console.log(e)
      setModal(<ErrorModal
        error={e}
        onClose={clearModal}
      />)
      return
    }
  }

  const onProjectUpload = async (settings: Settings, cards: Card[]) => {
    try {
      const data = await uploadCards(settings, cards)
      if (data === undefined) return

      const projects = [{
        id: uuid(),
        name: settings.name ?? '',
        code: settings.unit,
        unit: site.unitList.find(e => e.code == settings.unit)!,
        cards: data.map(card => ({
          id: uuid(),
          ...card,
        })),
      }]
      setModal(<SuccessModal
        message='Your images were successfully uploaded'
        projects={projects}
        urls={await createAutoSplitProject(settings, data)}
        onLoadProject={() => setTab({
          id: 'project',
          projects: projects,
        })}
        onClose={clearModal}
      />)
      return
    } catch (e) {
      console.log(e)
      setModal(<ErrorModal
        error={e}
        onClose={clearModal}
      />)
      return
    }
  }

  const onClick = () => setModal(<ImageSettingsModal
    site={site}
    cards={cards}
    onCardUpload={onCardUpload}
    onProjectUpload={onProjectUpload}
    onClose={clearModal}
  />)

  return (
    <Button variant='outline-primary' onClick={onClick} disabled={cards.length == 0}>
      <Upload /> Upload
    </Button>
  )
}

interface ProductDropdownProps {
  site: Site
  unit?: Unit
  setUnit: Dispatch<SetStateAction<Unit | undefined>>
}

const ProductDropdown = ({ site, unit, setUnit }: ProductDropdownProps) => {
  const onProductChange = (eventKey: string | null) => {
    setUnit(site.unitList.find(it => it.code == eventKey))
  }

  return (
    <Dropdown onSelect={onProductChange}>
      <Dropdown.Toggle variant='outline-primary'>
        {unit?.name ?? 'Select Product'}
      </Dropdown.Toggle>
      <Dropdown.Menu className='overflow-scroll' style={{ maxHeight: 300 }}>
        <Dropdown.Header>Recomended</Dropdown.Header>
        {site.unitList.filter(it => it.curated !== null).map(it => (
          <Dropdown.Item key={it.code} eventKey={it.code} active={it.code === unit?.code}>{it.name}</Dropdown.Item>
        ))}
        <Dropdown.Header>Other</Dropdown.Header>
        {site.unitList.filter(it => it.curated === null).map(it => (
          <Dropdown.Item key={it.code} eventKey={it.code} active={it.code === unit?.code}>{it.name}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

interface ImageTabToolbarProps {
  site: Site
  files: CardSide[]
  setFiles: Dispatch<SetStateAction<CardSide[]>>
  cards: Card[]
  setCards: Dispatch<SetStateAction<Card[]>>
  unit?: Unit
  setUnit: Dispatch<SetStateAction<Unit | undefined>>
  setModal: Dispatch<SetStateAction<JSX.Element | undefined>>
  clearModal: () => void
  setTab: (tab: TabProps) => void
}

const ImageTabToolbar = ({ site, setFiles, cards, setCards, unit, setUnit, setModal, clearModal, setTab }: ImageTabToolbarProps) => {
  const onAddCards = (newFiles: CardSide[], newCards: Card[]) => {
    setFiles(prevState => [
      ...prevState,
      ...newFiles,
    ])
    setCards(prevState => [
      ...prevState,
      ...newCards,
    ])
    clearModal()
  }

  const onAddEmpty = () => setCards(prevState => [
    ...prevState,
    {
      id: uuid(),
      count: 1,
    }
  ])

  const onClear = () => setCards([])

  const onPreview = () => setModal(<CardPreviewModal
    site={site}
    cards={cards}
    onClose={clearModal}
  />)

  return (
    <Stack direction='horizontal' gap={1}>
      <AddButton
        onAddCards={onAddCards}
        setModal={setModal}
        clearModal={clearModal}
      />
      <Button variant='outline-primary' onClick={onAddEmpty}>
        <PlusCircle /> Add empty card
      </Button>
      <Button variant='outline-primary' onClick={onClear}>
        <XCircle /> Clear
      </Button>
      <div className='flex-fill' />
      <ProductDropdown
        site={site}
        unit={unit}
        setUnit={setUnit}
      />
      <Button
        variant='outline-primary'
        onClick={onPreview}
        disabled={cards.length == 0}
      >
        <CardImage /> Preview
      </Button>
      <UploadButton
        site={site}
        cards={cards}
        setModal={setModal}
        clearModal={clearModal}
        setTab={setTab}
      />
    </Stack>
  )
}

export default ImageTabToolbar
