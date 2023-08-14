import { Unit } from '../types/mpc'
import { FilenameTooltip } from './AutofillTypeBasic'

interface CardCountProps {
  count: number
  unit?: Unit
}

const CardCount = ({ count, unit }: CardCountProps) => (
  <div className='text-end'>
    <FilenameTooltip text={unit ? `Card Count: ${count} / ${unit.maxCards}` : `Card Count: ${count}`}>
      {unit
        ? <>The max number of cards a project can have is {unit.maxCards}.</>
        : <>Choose a Product to see the max card count a project can have.</>
      }<br />
      If you add more than {unit?.maxCards ?? 'the max'} then the project will be automatically split into multiple projects.
    </FilenameTooltip>
  </div>
)

export default CardCount
