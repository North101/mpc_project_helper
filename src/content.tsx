import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './components/App'

const doctype = document.implementation.createDocumentType('html', '', '')
document.doctype?.parentNode?.replaceChild(doctype, document.doctype)

const head = document.head
const link = document.createElement('link')
link.type = 'text/css'
link.rel = 'stylesheet'
link.href = chrome.runtime.getURL('bootstrap.min.css')
head.appendChild(link)

const app = document.createElement('div')
app.id = 'mpc-project-helper'
document.body.appendChild(app)

const root = ReactDOM.createRoot(app)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
