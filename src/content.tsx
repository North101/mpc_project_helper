import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import "./popup.css";

const head = document.head;
const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
link.integrity = "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T";
link.crossOrigin = "anonymous";
head.appendChild(link);

const app = document.createElement('div');
app.id = 'mpc-project-helper';
document.body.appendChild(app);
ReactDOM.render(<App />, app);