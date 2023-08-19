import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { ParsedProject } from '../types/project'

type Modal = JSX.Element | undefined

type UseModalValue = [
  Modal,
  Dispatch<SetStateAction<Modal>>,
  () => void,
]

export const ModalContext = createContext<UseModalValue>([
  undefined,
  () => { throw Error('ModalContext') },
  () => { throw Error('ModalContext') },
])

export const useModal = (): UseModalValue => {
  const [modal, setModal] = useState<Modal>()
  const clearModal = () => setModal(undefined)
  return [modal, setModal, clearModal]
}

interface ProjectTabProps {
  id: 'project'
  projects: ParsedProject[]
}

interface ImageTabProps {
  id: 'items'
}

export type TabProps = ProjectTabProps | ImageTabProps | undefined

type UseTabValue = [
  TabProps,
  Dispatch<SetStateAction<TabProps>>,
]

export const TabContext = createContext<UseTabValue>([
  undefined,
  () => { throw Error('TabContext') },
])

export const useTab = (): UseTabValue => useState<TabProps>()
