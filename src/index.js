import React from "react";
import ReactDOM from "react-dom";

import Root from './root';
import registerServiceWorker from "./registerServiceWorker";
import "./scss/index.scss";

ReactDOM.render(<Root />, document.getElementById("root")); // eslint-disable-line no-undef

registerServiceWorker();
