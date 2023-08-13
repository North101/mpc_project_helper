import { Unit } from '../types/mpc'
import { FilenameTooltip } from './AutofillTypeBasic'

interface CardCountProps {
  count: number
  unit?: Unit
}

const CardCount = ({ count, unit }: CardCountProps) => (
  <div className='text-end'>
    <FilenameTooltip text={unit ? `Card Count: ${count} / ${unit.maxCards}` : `Card Count: ${count}`}>
      The max amount of cards a project can have is {unit?.maxCards ?? 'Unknown'}.<br />
      If you add more than {unit?.maxCards ?? 'the max'} then the project will be automatically split into multiple projects.
    </FilenameTooltip>
  </div>
)

export default CardCount
