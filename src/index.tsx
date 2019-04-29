import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";
import "./styles/style.scss";

// const y = Object.keys(x).some(key => (x as any)[key] === null);
// console.log(y);

const ROOT = document.querySelector(".app");
ReactDOM.render(<App />, ROOT);