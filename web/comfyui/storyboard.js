// src_web/comfyui/storyboard.ts
import { app } from "/scripts/app.js";
var LOG_LEVEL = 4;
var LOGGER_PREFIX = "[Storyboard]";
var Storyboard = class extends EventTarget {
  constructor() {
    super();
    this.log(3, "Initialized");
    this.injectCss();
  }
  injectCss() {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "extensions/storyboard/comfyui/styles/storyboard.css";
    document.head.appendChild(link);
    let link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.type = "text/css";
    link2.href = "extensions/storyboard/comfyui/styles/a11y-dark.min.css";
    document.head.appendChild(link2);
  }
  log(level, message, ...args) {
    if (level > LOG_LEVEL) {
      return;
    }
    const logFn = level === 1 ? "error" : level === 2 ? "warn" : "info";
    console[logFn](`${LOGGER_PREFIX} ${message}`, ...args);
  }
};
var storyboard = new Storyboard();
window.storyboard = storyboard;
app.registerExtension({
  name: "Comfy.Storyboard"
  // No node-specific logic here - each node type handles its own registration
});
export {
  storyboard
};
