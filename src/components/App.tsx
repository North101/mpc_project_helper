import 'bootstrap/dist/css/bootstrap.min.css'
import mpcData from 'mpc_api/data'
import { useState } from 'react'
import Modal from 'react-bootstrap/esm/Modal'
import Tab from 'react-bootstrap/esm/Tab'
import Tabs from 'react-bootstrap/esm/Tabs'
import { Site } from '../types/mpc'
import { ParsedProject } from '../types/project'
import './App.css'
import ImageTab from './ImageTab'
import ProjectTab from './ProjectTab'

interface ProjectTabProps {
  id: 'project'
  projects: ParsedProject[]
}

interface ImageTabProps {
  id: 'items'
}

export type TabProps = ProjectTabProps | ImageTabProps

const App = () => {
  const [show, setShow] = useState(false)
  const onShow = (request: { message: string }) => {
    if (request.message !== 'show') return
    setShow(true)
  }
  const onHide = () => setShow(false)
  chrome.runtime.onMessage.addListener(onShow)

  const [tab, setTab] = useState<TabProps | undefined>()
  const onTabChange = () => setTab(undefined)

  const data = mpcData.sites.find(site => site.urls.includes(location.host))
  const site = data ? new Site(data) : null

  return (
    <Modal show={show} fullscreen centered onHide={onHide} className='mpc-project-helper-dialog overscroll-hidden'>
      <Modal.Header closeButton>
        <Modal.Title>MPC Project Helper</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-column overflow-hidden'>
        {site ? <Tabs
          id='tabs'
          activeKey={tab?.id}
          defaultActiveKey='project'
          className='mb-3'
          onSelect={onTabChange}
        >
          <Tab eventKey='project' title='Project'>
            <ProjectTab
              site={site}
              projects={tab?.id == 'project' ? tab.projects : undefined}
            />
          </Tab>
          <Tab eventKey='image' title='Image'>
            <ImageTab
              site={site}
              setTab={setTab}
            />
          </Tab>
        </Tabs> : <div>
          MPC Project Helper is not compatible with {location.host}
        </div>}
      </Modal.Body>
    </Modal>
  )
}

export default App
