import * as React from "react";
import * as ReactDOM from "react-dom";
import { vkConnect } from "./external";

import { App } from "./App";

vkConnect.send("VKWebAppInit");
ReactDOM.render(<App />, document.getElementById("root"));
