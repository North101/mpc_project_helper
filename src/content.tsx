import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import "./popup.css";

const id = 'mpc-project-helper';

const head = document.head;
for (const href of ["https://cdn3.devexpress.com/jslib/21.1.5/css/dx.common.css", "https://cdn3.devexpress.com/jslib/21.1.5/css/dx.light.css"]) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = href;

  head.appendChild(link);
}

const app = document.createElement('div');
app.id = id;
app.setAttribute('style', 'position: absolute; top: 0; bottom: 0; right: 0; left: 0; height: 100%; width: 100%;');
document.body.appendChild(app);
ReactDOM.render(<App />, app);