import { app } from "scripts/app.js";

const LOG_LEVEL = 4; // 1:Error, 2:Warning, 3:Info, 4:Debug
const LOGGER_PREFIX = "[Storyboard]";

type ConsoleLogFns = "log" | "error" | "warn" | "debug" | "info";

class Storyboard extends EventTarget {
  constructor() {
    super();
    this.log(3, "Initialized");
    this.injectCss();
  }

  injectCss() {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "extensions/comfyui-storyboard/comfyui/storyboard.css";
    document.head.appendChild(link);
  }

  log(level: number, message: string, ...args: any[]) {
    if (level > LOG_LEVEL) {
      return;
    }
    const logFn: ConsoleLogFns =
      level === 1 ? "error" : level === 2 ? "warn" : "info";
    console[logFn](`${LOGGER_PREFIX} ${message}`, ...args);
  }
}

export const storyboard = new Storyboard();
(window as any).storyboard = storyboard;

// Register the main extension
app.registerExtension({
  name: "Comfy.Storyboard",
  // No node-specific logic here - each node type handles its own registration
}); 