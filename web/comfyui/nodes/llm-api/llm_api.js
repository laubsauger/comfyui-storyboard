// src_web/comfyui/nodes/llm-api/llm_api.ts
import { app } from "/scripts/app.js";

// src_web/common/constants.ts
var LOG_VERBOSE = true;

// src_web/common/shared_utils.ts
var log = (prefix, ...args) => {
  if (LOG_VERBOSE) {
    console.log(`[${prefix}]`, ...args);
  }
};

// src_web/comfyui/nodes/llm-api/llm_api.ts
app.registerExtension({
  name: "comfy.llm.OpenAIChatGPT",
  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name === "OpenAI Chat GPT") {
      const onExecuted = nodeType.prototype.onExecuted;
      nodeType.prototype.onExecuted = function(message) {
        var _a;
        onExecuted == null ? void 0 : onExecuted.apply(this, arguments);
        log("OpenAIChatGPT", `onExecuted for node ${this.id}. Message:`, message);
        const widget = (_a = this.widgets) == null ? void 0 : _a.find(
          (w) => w.name === "use_caching"
        );
        log("OpenAIChatGPT", "Found widget:", widget);
        if (widget) {
          let label = "use_caching";
          if (message == null ? void 0 : message.cache_status) {
            const status = message.cache_status[0];
            label += ` [ ${status} ]`;
          }
          widget.label = label;
          log("OpenAIChatGPT", `New widget label: ${widget.label}`);
        }
        this.setDirtyCanvas(true, true);
      };
    }
  },
  registerCustomNodes() {
  }
});
app.registerExtension({
  name: "comfy.llm.OpenAIAdvancedConfiguration",
  registerCustomNodes() {
  }
});
app.registerExtension({
  name: "comfy.llm.OpenAIAPIKeyManager",
  registerCustomNodes() {
  }
});
