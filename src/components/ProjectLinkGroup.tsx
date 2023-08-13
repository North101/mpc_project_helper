import Alert from 'react-bootstrap/esm/Alert'
import Button from 'react-bootstrap/esm/Button'
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup'

interface ProjectLinkGroupProps {
  urls: string[]
}

const ProjectLinkGroup = ({ urls }: ProjectLinkGroupProps) => (
  <div>
    <Alert variant='warning'>
      <Alert.Heading>Warning</Alert.Heading>
      <p>MPC Project Helper is reverse engineered and makes no guaranties that it is bug free or that {location.host} will not make changes that will break it.</p>
      <hr />
      <p>Always check the uploaded project and its images before purchasing.</p>
    </Alert>
    <div className='d-flex justify-content-center'>
      <ButtonGroup className='d-flex button-group w-75' vertical>
        {urls.map((url, index) => <Button
          key={index}
          variant='primary'
          href={url}
          target='_blank'
        >
          {`Open Project (${index + 1}/${urls.length})`}
        </Button>)}
      </ButtonGroup>
    </div>
  </div>
)

export default ProjectLinkGroup
