import { FilenameTooltip } from './AutofillTypeBasic'

interface CardCountProps {
  count: number
}

const CardCount = ({ count }: CardCountProps) => (
  <div className='text-end'>
    <FilenameTooltip text={`Card Count: ${count}`}>
      If you add more than the max then the project will be automatically split into multiple projects.
    </FilenameTooltip>
  </div>
)

export default CardCount
