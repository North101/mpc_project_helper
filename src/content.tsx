import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import "./popup.css";

const links = [
  "https://cdn3.devexpress.com/jslib/21.1.5/css/dx.common.css",
  "https://cdn3.devexpress.com/jslib/21.1.5/css/dx.light.css",
];

const head = document.head;
for (const href of links) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = href;

  head.appendChild(link);
}

const app = document.createElement('div');
app.id = 'mpc-project-helper';
document.body.appendChild(app);
ReactDOM.render(<App />, app);