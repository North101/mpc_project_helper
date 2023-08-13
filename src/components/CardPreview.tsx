import { Card } from '../types/card'

interface CardPreviewProps {
  height: number
  width: number
  card: Card
}

const CardPreview = ({ height, width, card }: CardPreviewProps) => {
  return (
    <div className='d-flex flex-column align-items-center gap-2 border p-2' style={{ width: width + 16 }}>
      <div className='d-flex gap-2'>
        <div className='d-flex justify-content-center' style={{ height: height / 2, width: width / 2 }}>
          <img src={card.front ? URL.createObjectURL(card.front.file) : ''}></img>
        </div>
        <div className='d-flex justify-content-center' style={{ height: height / 2, width: width / 2 }}>
          <img src={card.back ? URL.createObjectURL(card.back.file) : ''}></img>
        </div>
      </div>
    </div >
  )
}

export default CardPreview
