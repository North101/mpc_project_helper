import * as React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";
import "./popup.css";

const doctype = document.implementation.createDocumentType('html', '', '');
document.doctype?.parentNode?.replaceChild(doctype, document.doctype);

const head = document.head;
const link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('bootstrap.min.css');
link.integrity = 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T';
link.crossOrigin = 'anonymous';
head.appendChild(link);

const app = document.createElement('div');
app.id = 'mpc-project-helper';
document.body.appendChild(app);

const root = ReactDOM.createRoot(app);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
