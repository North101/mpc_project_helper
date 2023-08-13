import { Dispatch, SetStateAction, useState } from 'react'

type Modal = JSX.Element | undefined

type UseModalValue = [
  Modal,
  Dispatch<SetStateAction<Modal>>,
  () => void,
]

export const useModal = (): UseModalValue => {
  const [modal, setModal] = useState<Modal>()
  const clearModal = () => setModal(undefined)
  return [modal, setModal, clearModal]
}
