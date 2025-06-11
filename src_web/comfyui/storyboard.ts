import { app } from "scripts/app.js";
import {
  handleMarkdownRendererCreated,
  setupMarkdownRenderer,
} from "./markdown_renderer.js";

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

  async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
    if (nodeData.name === "MarkdownRenderer") {
      setupMarkdownRenderer(nodeType, nodeData);
    }
  }

  async nodeCreated(node: any) {
    if (node.comfyClass === "MarkdownRenderer") {
      handleMarkdownRendererCreated(node);
    }
  }
}

export const storyboard = new Storyboard();
(window as any).storyboard = storyboard;

app.registerExtension({
  name: "Comfy.Storyboard",
  beforeRegisterNodeDef: storyboard.beforeRegisterNodeDef.bind(storyboard),
  nodeCreated: storyboard.nodeCreated.bind(storyboard),
}); 